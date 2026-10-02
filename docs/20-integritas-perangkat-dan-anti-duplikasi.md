# 20. Integritas Perangkat dan Pencegahan Suara Ganda

## Status dan batas keputusan

**Status: kode selesai, menunggu verifikasi database/UAT pada 2026-10-03.** Tidak ada pengiriman OTP pada alur vote. Implementasi menegakkan satu NIM satu suara dan satu **browser normal** satu pemilih melalui dua token browser yang terpisah, tanpa menjadikan IP sebagai pengunci. Perangkat berbeda pada Wi-Fi yang sama tetap dapat memilih, dan reset suara membuat token browser dapat digunakan lagi untuk event tersebut.

Sebelum pekerjaan ini, implementasi hanya menjamin satu vote sah per `(election_id, voter_id)`, memakai token sesi singkat, dan membatasi percobaan verifikasi berdasarkan alamat jaringan. Source sekarang memiliki migration kompatibel ke belakang, kontrak API, dua unique index perangkat, serta reset terkait. Jangan membuka event atau menyatakan siap production sampai migration staging, test, UAT, dan sign-off privasi selesai.

Keputusan yang disetujui user tercatat sebagai `DEC-04` di `17-decision-register.md`: mode tanpa OTP, device-binding, retensi sinyal keamanan, jalur bantuan, dan waktu berlakunya.

## Hasil yang ditargetkan

| Kebutuhan | Aturan target | Pengaman utama |
| --- | --- | --- |
| Satu NIM, satu suara | Satu voter hanya memiliki satu vote sah dalam satu event. | Transaction dan `UNIQUE(election_id, voter_id)`. |
| Satu browser/perangkat, satu pemilih | Perangkat yang sudah menyelesaikan vote tidak dapat menyelesaikan vote untuk NIM lain pada event sama. | `UNIQUE(election_id, device_binding_hash)` saat commit vote. |
| Wi-Fi bersama | Banyak perangkat berbeda di alamat jaringan yang sama boleh memilih. | IP tidak pernah memiliki unique constraint atau blokir satu-vote. |
| Deteksi pengelakan | Penghapusan salah satu dari cookie/local storage tetap ditahan oleh token lainnya. Penghapusan keduanya atau browser lain tetap batas teknis yang harus diakui. | Dua unique index token browser; tidak ada fingerprint invasif. |
| Setelah reset suara | Claim perangkat, sesi, receipt, dan rate-limit event dilepas bersama semua vote event. | Satu transaction reset admin ber-audit. |

### Batas teknis yang wajib jujur

Browser biasa tidak dapat membuktikan satu **perangkat fisik** secara permanen. Cookie dapat dihapus, storage dapat dibersihkan, mode privat menghasilkan identitas baru, dan fingerprint browser dapat berubah atau dipalsukan. Karena itu:

- Device binding adalah penghambat penyalahgunaan dan pencegah penggunaan ulang normal pada browser/perangkat yang sama; ia bukan bukti identitas manusia.
- IP address adalah sumber jaringan, bukan orang atau perangkat. Ia tidak boleh menjadi “satu IP satu vote”.
- Fingerprint adalah sinyal probabilistik dengan false positive/negative; ia tidak boleh sendirian menolak pemilih.
- Tanpa OTP atau SSO, NIM + device binding hanya mencegah duplikasi teknis yang terlihat. Ia tidak membuktikan bahwa pemegang NIM adalah orang yang benar dan tidak boleh dipasarkan sebagai jaminan “satu orang satu suara” secara fisik.
- Jika panitia benar-benar memerlukan satu perangkat fisik yang tidak bisa dipakai ulang, voting harus diawasi pada perangkat kampus terkelola atau memakai authenticator/attestation yang disetujui. Website publik tidak boleh menjanjikan jaminan tersebut.

## Kebijakan kontrol berlapis

| Lapisan | Data/pengolahan | Saat dipakai | Keputusan | Boleh menolak otomatis? |
| --- | --- | --- | --- | --- |
| Hak pilih | NIM dinormalisasi + master eligible | Verifikasi dan submit | NIM tidak ada, tidak eligible, atau sudah memiliki vote sah. | Ya. |
| Kepemilikan NIM | Tidak ada OTP/SSO pada rilis ini. | Setelah NIM valid | Tidak ada bukti kepemilikan tambahan; risiko impersonasi dicatat sebagai batas kebijakan. | Tidak. |
| Device binding | Cookie `HttpOnly` server dan token instalasi local storage, masing-masing di-HMAC | Verify dan commit atomik | Salah satu claim browser sudah terikat pada voter lain untuk event yang sama. | Ya, dengan pesan generik. |
| Integritas sesi | Token opaque, TTL pendek, diikat ke device hash | Submit | Token habis, sudah dipakai, atau device tidak cocok. | Ya. |
| IP/network | IP dinormalisasi lalu di-HMAC per versi | Verify/submit | Volume, rasio gagal, atau otomasi abnormal. | Hanya rate-limit/challenge, bukan unique vote. |
| Fingerprint perangkat | Tidak dikumpulkan pada rilis ini. | Tidak berlaku | Tidak ada fingerprint biometrik maupun canvas/WebGL. | Tidak. |
| Database | Constraint, FK, lock event, idempotency | Commit/reset | Race condition, submit ulang, atau reset bersamaan. | Ya. |

Urutannya penting: tidak ada score risiko yang boleh menggantikan constraint vote. Tidak ada blokir IP yang boleh mencegah kelas dalam Wi-Fi yang sama memilih dari HP masing-masing.

## Identitas browser yang diimplementasikan

### 1. Dua token browser sebagai pengikat

Saat verifikasi, client membuat nilai acak kriptografis 256-bit dan menyimpannya pada local storage asal aplikasi sebagai token instalasi. Server juga menerbitkan cookie acak `HttpOnly`, `Secure` pada production, `SameSite=Lax`, same-origin, dan ber-TTL 30 hari yang tidak dapat dibaca JavaScript. Keduanya tidak pernah masuk URL, analytics, audit, maupun log aplikasi.

Untuk setiap verify/submit, server menghitung:

```text
device_cookie_hash       = HMAC(VOTING_TOKEN_SECRET, "vote-device-binding:v1" || server_device_cookie)
device_installation_hash = HMAC(VOTING_TOKEN_SECRET, "vote-device-installation:v1" || installation_token)
```

Database hanya menyimpan kedua HMAC dan version (`v1`), bukan token instalasi maupun nilai cookie mentah. Session wajib cocok dengan hash cookie yang sama saat submit. Vote menyimpan kedua claim dan masing-masing memiliki unique index per event. Karena itu penghapusan **salah satu** cookie atau local storage tetap ditahan oleh claim lain pada verifikasi berikutnya.

Jika seseorang sengaja menghapus **keduanya**, berpindah browser, atau memakai mode privat, website tidak dapat mengetahui bahwa itu perangkat fisik yang sama. Rilis ini tidak menggantinya dengan fingerprint agresif atau klaim identitas palsu. Kasus bantuan ditangani panitia tanpa membuka atau mengubah pilihan suara.

### 2. Tidak ada fingerprint invasif

Rilis ini tidak memakai fingerprint browser/HP. Tidak ada pengumpulan biometrik, lokasi presisi, daftar font, canvas/WebGL/audio fingerprint, hardware serial, kontak, maupun layanan fingerprint pihak ketiga. IP mentah hanya dipakai sementara untuk rate limit dan segera di-HMAC; ia bukan pengunci vote.

CAPTCHA adaptif, fingerprint minim, dan risk engine bukan bagian dari implementasi aktif. Jika diperlukan kelak, ketiganya memerlukan keputusan baru, notice privasi, accessibility fallback, serta test tersendiri; tidak boleh sendiri menjadi alasan menolak pemilih.

### 3. Batas kepemilikan NIM tanpa OTP

Rilis ini tidak mengirim OTP dan tidak mengaktifkan SSO. NIM hanya diperiksa terhadap master internal. Device binding mempersempit penggunaan ulang browser/perangkat, tetapi tidak membuktikan kepemilikan NIM; ancaman seseorang yang mengetahui NIM teman tetap ada. Jika risiko ini tidak dapat diterima, pemilihan harus dilakukan dengan pendampingan panitia atau keputusan faktor autentikasi baru pada pekerjaan terpisah.

## Alur vote yang diimplementasikan

```mermaid
sequenceDiagram
  participant B as Browser/perangkat
  participant V as Verify API
  participant S as Vote service
  participant D as PostgreSQL

  B->>V: NIM + installation token
  V->>V: HMAC IP/cookie/installation; rate check
  V->>D: buat voting session berikat device hash
  V-->>B: token sesi singkat
  B->>S: candidate + token sesi + idempotency key (cookie terkirim same-origin)
  S->>D: lock event/session; cek voter, device, dan candidate
  D->>D: insert vote dengan dua claim perangkat unik
  D-->>S: commit atau device/voter conflict
  S-->>B: receipt aman atau pesan generik
```

### Detail keputusan di server

1. Server memeriksa event `open`, format NIM, eligible, dan bahwa voter belum mempunyai vote sah.
2. IP hanya masuk bucket rate-limit HMAC. Banyak request sah dari IP kampus yang sama tidak menolak semua pemilih; limit IP sengaja longgar dan harus dibuktikan melalui load test.
3. Server membuat `voting_session` TTL 10 menit berisi `voter_id`, hash cookie, hash instalasi, IP hash, version, dan status `issued`.
4. Saat submit, server menghitung ulang hash cookie dan harus sama dengan hash sesi. Candidate divalidasi kembali di server.
5. Satu statement atomik mengunci event/sesi lalu memasukkan vote yang membawa dua claim browser. Konflik voter berarti `already_voted`; konflik cookie atau instalasi berarti `device_already_used`. Respons publik tidak mengungkap NIM atau pemilih lain.
6. Hanya setelah commit, sesi menjadi `submitted`, rekap dipublikasikan, dan receipt dikeluarkan. Retry idempoten tetap mengembalikan receipt awal.

## Kontrak data target

### Perubahan `voting_sessions`

| Kolom | Aturan |
| --- | --- |
| `device_binding_hash` | Wajib pada high-security mode; HMAC versioned, tidak pernah nilai mentah. |
| `device_installation_hash` | Wajib untuk mode ini; HMAC token local storage, tidak pernah nilai mentah. |
| `signal_version` | Wajib bila signal disimpan agar rotasi key/format dapat dipahami. |
| `ip_hash` | Nullable HMAC versioned; dipakai rate/risk, bukan identity. |
| `risk_level` | `normal`, `step_up_required`, atau `review`; jangan menyimpan alasan/atribut mentah. |

### Claim perangkat pada `votes`

| Kolom | Aturan |
| --- | --- |
| `device_binding_hash` | HMAC cookie server; tidak menyimpan nilai mentah. |
| `device_installation_hash` | HMAC token instalasi local storage; tidak menyimpan nilai mentah. |
| `hash_version` | Versi format/hash untuk rotasi aman. |
| `election_id`, `voter_id`, `id`, `cast_at` | Konteks vote yang memiliki dua claim tersebut. |

Constraint wajib:

```text
UNIQUE (election_id, voter_id)
UNIQUE INDEX (election_id, device_binding_hash) WHERE device_binding_hash IS NOT NULL
UNIQUE INDEX (election_id, device_installation_hash) WHERE device_installation_hash IS NOT NULL
```

Kedua unique index berada pada `votes` yang sama dengan constraint voter. Insert atomik memakai `ON CONFLICT DO NOTHING`; tidak ada tabel binding terpisah yang dapat tertinggal setelah konflik request paralel.

## IP dan Wi-Fi bersama

| Kejadian | Perilaku target |
| --- | --- |
| Dua HP berbeda memakai Wi-Fi kampus yang sama | Keduanya boleh verify dan commit, selama NIM dan device binding masing-masing valid. |
| Satu HP mencoba NIM kedua setelah vote pertama | Device binding conflict; tidak ada informasi tentang pemilih pertama. |
| Banyak NIM invalid dari jaringan sama | Rate limit dan monitor agregat; jangan mengunci seluruh Wi-Fi tanpa threshold/load test. |
| IP berubah dari Wi-Fi ke seluler di tengah sesi | Tidak membatalkan suara sendiri; server dapat step-up bila risk policy menilai perlu. |
| Satu perangkat berbagi hotspot | Dianggap satu device untuk binding, tetapi tidak memblokir device lain yang memakai hotspot tersebut. |

Bucket rate-limit dipisah untuk NIM, IP, device, dan sesi. Batas produksi ditentukan dari load test dengan skenario satu kelas atau seluruh angkatan pada Wi-Fi yang sama; angka default tidak boleh dipilih hanya dari asumsi.

## UX dan pesan aman

- Sebelum field NIM, tampilkan notice singkat: “NIM, perangkat browser, dan alamat jaringan diproses secara terbatas untuk menjaga satu suara per pemilih. Data ini tidak tampil publik.” Tautkan ringkasan privasi.
- Jangan menyebut “fingerprint”, alamat IP, NIM lain, atau rule score dalam error publik.
- Jika device sudah dipakai, tampilkan: “Verifikasi tidak dapat dilanjutkan pada perangkat ini. Gunakan perangkat pribadi lain atau hubungi panitia melalui kanal resmi.”
- Alur aktif tidak mengirim OTP dan belum memakai CAPTCHA; penambahan CAPTCHA perlu keputusan serta fallback aksesibel baru.
- Kanal bantuan tidak boleh memungkinkan admin membuka atau mengubah pilihan vote. Dukungan hanya mengikuti SOP manual yang disetujui panitia.

## Reset dan bantuan

### Reset suara voting

Reset global oleh admin tetap membutuhkan sesi admin, alasan, konfirmasi `RESET SUARA VOTING`, event lock, dan audit. Dalam satu transaction ia wajib:

1. mengubah event ke `scheduled` dan hasil ke `hidden`;
2. mencabut `voting_sessions` yang belum selesai;
3. menghapus seluruh vote/receipt event beserta dua claim perangkat yang melekat;
4. menghapus seluruh rate-limit vote event; lalu
5. menulis satu audit reset tanpa NIM, IP, device hash, token, maupun pilihan per orang.

Sesudah commit, NIM dan perangkat dapat digunakan lagi untuk event yang telah di-reset. Audit reset tetap ada, tetapi tidak menghubungkan perangkat dengan vote lama pada layar operasional biasa.

### Tidak ada unlock perangkat individual saat event open

Melepas satu device binding setelah ia mempunyai vote akan membuka jalur satu perangkat untuk voter lain. Karena itu UI tidak menyediakan tombol “reset device” per pemilih saat event `open`. Dugaan false positive ditangani melalui kanal bantuan sebelum vote diterima. Perubahan luar biasa setelah vote harus mengikuti SOP sengketa/void dua admin; ia tidak pernah mengubah pilihan vote secara diam-diam.

## Privasi, akses, dan retensi

- Semua hash menggunakan HMAC server-side dengan secret yang dikelola di environment/secret manager, domain separation (`ip`, `device-binding`, `device-installation`), dan `hash_version`; bukan SHA-256 polos.
- IP mentah hanya hidup dalam memori request dan tidak masuk database, audit, analytics, error tracking, atau export.
- Token instalasi, cookie device, token sesi, dan secret tidak disimpan pada audit/log.
- Dua hash claim browser termasuk data sangat terbatas. Akses hanya service database; tidak ada pada hasil, tabel peserta, audit, maupun ekspor partisipasi biasa.
- Retensi default: sesi dan hash claim browser dihapus atau dianonimkan 30 hari setelah hasil disahkan, kecuali ada sengketa yang dicatat sesuai kebijakan panitia. Pilihan vote dan identitas tidak diekspor bersama untuk investigasi biasa.
- Pemberitahuan privasi dan dasar pemrosesan harus disetujui pemilik data sebelum fitur aktif. Pengumpulan biometrik, lokasi presisi, dan third-party tracking berada di luar scope.

## Monitoring dan respons

Metrik hanya agregat per event/window: verify success/failure, device conflict count, submit accepted/conflict, IP bucket saturation, dan waktu respons. Alert mencari lonjakan, bukan identitas personal.

| Sinyal | Respons |
| --- | --- |
| Conflict device naik tajam | Periksa release/version bug dan load; jangan auto-ban Wi-Fi. |
| Invalid NIM tinggi dari satu network hash | Periksa bucket rate limit dan load; jangan auto-ban Wi-Fi. |
| Banyak cookie/local storage dihapus | Tidak ada klaim identitas otomatis; tinjau kebutuhan kebijakan/pendampingan pada event berikutnya. |
| Database/device constraint error | Fail closed, tampilkan pesan sementara, dan jangan menerima vote lokal. |

## Acceptance dan rollout

| ID | Skenario | Bukti lulus |
| --- | --- | --- |
| DEV-01 | Dua submit paralel dari NIM sama, perangkat sama/berbeda | Tepat satu vote sah dan satu receipt canonical. |
| DEV-02 | Perangkat A telah vote dengan NIM A lalu mencoba NIM B | Vote kedua ditolak generik oleh unique device binding; tidak ada PII bocor. |
| DEV-03 | HP A dan HP B memakai Wi-Fi/IP publik sama dengan NIM berbeda | Kedua vote sah selama semua kontrol lain lulus. |
| DEV-04 | IP berubah di antara verify dan submit | Sistem tidak menolak semata karena IP berubah. |
| DEV-05 | Hanya cookie atau hanya local storage perangkat dihapus setelah vote | Verify NIM lain tetap ditolak oleh claim browser yang masih ada. |
| DEV-06 | Cookie dan local storage keduanya dihapus / browser lain dipakai | Catat sebagai batas browser: tidak ada jaminan perangkat fisik tanpa faktor autentikasi atau perangkat terkelola. |
| DEV-07 | Reset suara voting | Vote, receipt, session, dua claim browser, dan rate limit vote terhapus; audit tetap ada. |
| DEV-08 | Raw IP/device token dicari pada API, HTML, log, audit, dan export | Tidak ditemukan; hanya HMAC/metadata minimal di storage sangat terbatas. |
| DEV-09 | Mode NIM + device binding | Tidak ada OTP/email request atau data kontak pada request, session, audit, maupun UI. |
| DEV-10 | Load test kelas pada satu Wi-Fi | Tidak ada blokir massal karena IP bersama; latency/error memenuhi target disetujui. |

### Status rollout

1. User menyetujui `DEC-04` tanpa OTP dan entry `EXE-20261003-24` mencatat pekerjaan ini.
2. Source telah menambahkan kolom sesi/vote dan dua unique index dengan `IF NOT EXISTS`; migration tetap harus diuji pada database staging sebelum event dibuka.
3. Verify, submit, reset, notice UI, serta pesan konflik generik telah diubah mengikuti kontrak ini.
4. Typecheck, lint, build, dan pemeriksaan diff dijalankan oleh entry eksekusi; test integrasi `DEV-*`, load test Wi-Fi bersama, backup/restore, serta UAT fixture non-production masih merupakan gate wajib.
5. Production hanya boleh dibuka setelah privacy notice, UAT, dan review dua admin bila kebijakan panitia memerlukannya.
