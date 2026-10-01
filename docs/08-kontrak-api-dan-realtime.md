# 08. Kontrak API dan Realtime

API di bawah adalah kontrak konseptual. Implementasi dapat memakai Route Handlers atau Server Actions, namun otorisasi, validasi, kode kesalahan, dan bentuk data publik harus setara.

## Konvensi umum

- Semua body JSON memakai UTF-8; request tervalidasi schema.
- Semua waktu API memakai ISO 8601 UTC; UI mengubah ke WIB.
- Respons memuat `requestId` untuk korelasi support tanpa memuat PII.
- Endpoint mutasi memakai `Cache-Control: no-store`, CSRF defense untuk cookie session, dan origin checking.
- HTTP 429 menyertakan `Retry-After`; tidak mengungkap ambang internal.

## Endpoint publik

| Method dan path | Input | Respons aman | Catatan |
| --- | --- | --- | --- |
| `GET /api/v1/elections/{slug}` | slug | judul, status, jadwal, visibility, calon publik | Cache pendek saat tidak open. |
| `GET /api/v1/elections/{slug}/results` | slug | agregat sesuai visibility | Tidak ada PII. |
| `POST /api/v1/elections/{slug}/verify-nim` | NIM, anti-bot token bila dipicu | `sessionToken`, expiry atau error generik | Rate limit ketat. |
| `POST /api/v1/elections/{slug}/votes` | session token, candidate ID, idempotency key | receipt atau status submit sama | Transactional. |
| `GET /api/v1/elections/{slug}/receipts/{code}` | receipt | status receipt tanpa calon/NIM | Opsional; rate limit. |

### Contoh submit vote

```json
{
  "sessionToken": "opaque-short-lived-token",
  "candidateId": "b5bf...",
  "idempotencyKey": "random-client-uuid"
}
```

Respons sukses:

```json
{
  "status": "accepted",
  "receiptCode": "PGSD-7KQ4-8M2X",
  "castAt": "2026-10-01T03:25:10Z",
  "requestId": "req_..."
}
```

Kode aplikasi yang perlu ditangani UI: `election_not_open`, `invalid_or_expired_session`, `candidate_unavailable`, `already_voted`, `rate_limited`, `verification_required`, dan `temporarily_unavailable`. Untuk `invalid_nim` dan `already_voted`, tampilan publik dapat memakai pesan sama bila panitia ingin mengurangi enumerasi NIM.

## Endpoint admin

| Area | Aksi | Akses |
| --- | --- | --- |
| Event | create, update draft, schedule, open, close, archive | admin; open/close memakai second-admin approval bila diterapkan |
| Calon | CRUD calon individu sebelum open | admin |
| Peserta | upload, validate preview, commit import, override eligibility beralasan | admin |
| Hasil | lihat rekap dan buat ekspor | admin |
| Audit | lihat/filter/export log | admin |
| Koreksi | ajukan/approve void | admin pengaju dan admin penyetuju harus akun berbeda |

Setiap endpoint admin mewajibkan auth, admin-only policy, CSRF, audit event, dan reason untuk aksi berdampak. Semua endpoint admin menolak event yang sudah open/closed bila aksinya mengubah konfigurasi terkunci.

## Event realtime

Channel publik: `election:{slug}:public`. Pesan memuat agregat hasil live: total suara sah, partisipasi, serta total dan persentase suara setiap calon. Tidak ada PII atau data suara individual.

```json
{
  "type": "results.updated",
  "electionSlug": "ketua-angkatan-pgsd-2026",
  "revision": 42,
  "occurredAt": "2026-10-01T03:25:10Z",
  "data": {
    "totalCast": 206,
    "totalEligible": 437,
    "turnoutPercent": 47.14,
    "candidateResults": [
      { "candidateId": "b5bf...", "voteCount": 113, "votePercent": 54.85 },
      { "candidateId": "aa12...", "voteCount": 93, "votePercent": 45.15 }
    ]
  }
}
```

`revision` harus monotonik. Klien mengabaikan event lebih lama dan melakukan refetch jika ada loncatan/gagal parse. Kanal admin terautentikasi dapat memuat notifikasi impor atau risk alert, tetapi tidak boleh mengirim vote individual ke browser yang tidak berhak.

## Rate limit awal

| Endpoint | Kunci limit | Respons |
| --- | --- | --- |
| View publik | IP/session | Longgar; cache CDN bila aman. |
| Verify NIM | IP hash + NIM hash + session | Kecil; setelah threshold gunakan CAPTCHA/adaptive delay. |
| Submit vote | session + voter + IP hash | Sangat kecil; idempotency retry diizinkan. |
| Login panitia | identifier + IP | Ketat, lockout sementara, alert. |
| Ekspor | admin user | Kecil; job asynchronous untuk file besar. |

Angka limit final ditentukan dari load test dan kapasitas provider; jangan menebak angka produksi tanpa pengujian.

## Envelope respons dan error

Semua respons error mengikuti bentuk yang konsisten agar UI dapat memulihkan kondisi tanpa membaca pesan bebas dari server.

```json
{
  "error": {
    "code": "already_voted",
    "message": "Status voting untuk data ini tidak dapat diproses.",
    "recoverable": true,
    "retryAfterSeconds": null
  },
  "requestId": "req_..."
}
```

| Kode | HTTP | UI publik | Detail audit internal |
| --- | --- | --- | --- |
| `validation_failed` | 400 | Tandai field tanpa membocorkan master. | Field rule yang gagal. |
| `election_not_open` | 409 | Tampilkan status/jadwal. | State dan server time. |
| `invalid_or_expired_session` | 401/409 | Minta verifikasi ulang. | Session status/reason code. |
| `already_voted` | 409 | Pesan netral dan tautan bantuan/receipt. | Voter ID/receipt reference, restricted. |
| `candidate_unavailable` | 409 | Refresh calon dan pilih ulang. | Candidate/event state. |
| `rate_limited` | 429 | Tunggu/coba kembali atau challenge. | Rule bucket dan correlation ID. |
| `forbidden` | 403 | Akses admin ditolak. | Admin policy result. |
| `temporarily_unavailable` | 503 | Jangan mengasumsikan vote masuk; cek receipt sebelum retry. | Dependency health. |

## Kontrak idempotency dan receipt

- Browser membuat `idempotencyKey` acak per niat submit, menyimpannya selama alur aktif, dan memakai key sama bila retry request yang sama.
- Server menyimpan hash key bersama voter/event/request payload canonical/result selama TTL yang ditentukan. Key sama dengan payload berbeda ditolak sebagai conflict.
- Respons accepted yang diulang mengembalikan receipt dan `castAt` persis dari vote awal.
- Receipt lookup tidak pernah menampilkan calon, NIM, nama, perangkat, atau IP. Ia hanya dapat mengonfirmasi accepted/time sesuai kebijakan panitia.
- Receipt bukan token login dan tidak memberi izin koreksi suara.

## Endpoint panitia rinci

| Method/path konseptual | Aksi | Request penting | Respons | Audit wajib |
| --- | --- | --- | --- | --- |
| `POST /admin/elections` | Buat draft | title, slug, timezone | event draft | create event. |
| `PATCH /admin/elections/{id}` | Ubah draft | field yang diizinkan + revision | event terbaru | before/after allowlist. |
| `POST /admin/elections/{id}/schedule` | Jadwalkan | opens/closes, visibility | scheduled event | jadwal dan actor. |
| `POST /admin/elections/{id}/open` | Buka event | approval/confirmation | open event | actor, time, config snapshot hash. |
| `POST /admin/elections/{id}/close` | Tutup event | reason bila manual | closed event | actor, time, final revision. |
| `POST /admin/elections/{id}/reset-draft-request` | Ajukan reset draft | reason, re-auth, idempotency key | request pending | state/count sebelum aksi. |
| `POST /admin/reset-requests/{id}/approve` | Sahkan reset draft | approval reason | event draft terbaru | approver berbeda. |
| `POST /admin/elections/{id}/create-replacement-request` | Ajukan pemilihan ulang | reason, replacement slug | request pending | event lama/reason. |
| `POST /admin/replacement-requests/{id}/approve` | Sahkan event pengganti | approval reason | event draft baru | lineage dan approver berbeda. |
| `POST /admin/imports` | Upload master | multipart file, election ID | import ID | upload hash/metadata. |
| `POST /admin/imports/{id}/commit` | Commit import | reviewer confirmation | count summary | import approval. |
| `POST /admin/votes/{id}/void-request` | Ajukan void | reason/evidence reference | request pending | requester/reason. |
| `POST /admin/void-requests/{id}/approve` | Sahkan void | approval reason | updated rekap | approver berbeda. |
| `POST /admin/exports` | Generate export | type/filter | async job/download reference | data scope. |

Endpoint mutasi admin memakai optimistic concurrency (`revision`/`updatedAt`) untuk mencegah satu admin menimpa draft admin lain secara senyap. Action `open`, `close`, dan `void approve` meminta re-auth/MFA step-up bila provider mendukungnya.

Reset draft hanya dapat disetujui saat event `draft`/`scheduled` dan `total_cast = 0`. Event yang memiliki vote sah tidak memiliki endpoint penghapusan/reset; gunakan event pengganti ber-ID/slug baru sesuai `13-reset-dan-pengulangan-event.md`.

## Caching, headers, dan CORS

- Public read endpoint dapat memakai `ETag`/`If-None-Match` dan `Cache-Control` pendek. Vote, verify, receipt, admin, dan error response memakai `no-store`.
- CORS hanya dibuka untuk domain aplikasi yang disetujui; browser app yang sama sebaiknya memakai same-origin request.
- Security headers meliputi CSP yang kompatibel dengan font/canvas yang disetujui, `frame-ancestors` untuk mencegah clickjacking, `X-Content-Type-Options`, dan `Referrer-Policy` yang tidak membocorkan path sensitif.
- Endpoint upload membatasi origin, content type, ukuran, dan rate; file tidak pernah dieksekusi dari storage.

## Lifecycle realtime di klien

1. Muat snapshot hasil dari REST dengan `revision` terakhir.
2. Sambungkan channel publik hanya setelah snapshot berhasil dirender.
3. Terapkan event dengan revision lebih besar; event sama/lebih lama diabaikan.
4. Saat disconnect, tampilkan indikator `Memperbarui hasil…`, gunakan backoff reconnect, dan polling read endpoint.
5. Saat reconnect, refetch snapshot sebelum kembali mengandalkan stream.
6. Tidak ada event realtime yang dianggap bukti vote pemilih; hanya respons accepted/receipt dari submit yang menjadi bukti.
