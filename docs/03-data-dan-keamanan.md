# 03. Data dan Keamanan

## Model data konseptual

| Entitas | Data inti | Catatan |
| --- | --- | --- |
| `Election` | judul, zona waktu, buka/tutup, status, kebijakan hasil | Satu event pemilihan. |
| `Candidate` | election, nomor urut, nama, kelas sumber, foto, visi-misi, status | Calon hanya dapat diubah sebelum voting dibuka. |
| `Voter` | NIM, nama, kelas, sumber impor, eligible | NIM disimpan sebagai teks agar nol awal tidak hilang. |
| `Vote` | election, voter, calon, waktu sah, receipt code | Constraint unik pada election + voter. |
| `VotingSession` | voter sementara, token sesi, device signal terhash, IP terhash, status, kedaluwarsa | Untuk pencegahan penyalahgunaan, bukan identitas primer. |
| `AuditLog` | aktor, aksi, target, alasan, metadata minimal, waktu | Append-only; pilihan calon tidak dicantumkan dalam log publik. |

Pilihan suara dan identitas pemilih dipisahkan secara logis. Tabel/akses rekap publik hanya menerima agregat, bukan pasangan NIM-calon. Akses data pilihan individual dibatasi untuk audit resmi yang disetujui panitia.

## Impor spreadsheet

Sumber saat ini memiliki 12 sheet kelompok: Garuda, Rajawali, Harimau, Elang, Serigala, Gajah, Kuda, Lumba Lumba, Singa, Kancil, Merak, dan Burung Hantu. Kolom yang diperlukan dari setiap sheet adalah `NIM`, `NAMA`, dan `KELAS`; kolom `TTD` dipertahankan sebagai referensi kehadiran, bukan penentu hak pilih hingga panitia memutuskan.

Pipeline impor:

1. Unggah hanya oleh admin.
2. Baca dan normalisasi NIM sebagai string; trim nama/kelas.
3. Deteksi NIM kosong/duplikat dan tampilkan pratinjau sebelum commit.
4. Simpan hasil impor, waktu, akun admin, dan hash file; file sumber tidak dijadikan publik.

## Pencegahan suara ganda dan kecurangan

Kontrol utama adalah constraint unik di database dan transaksi server. Sinyal perangkat hanya lapisan tambahan:

| Kontrol | Fungsi | Batasan |
| --- | --- | --- |
| NIM + daftar master | Menetapkan hak pilih awal. | NIM dapat diketahui orang lain; belum cukup kuat bila dipakai sendirian. |
| Session token HTTP-only dan kedaluwarsa | Mengikat proses voting pada sesi yang sah. | Tidak menggantikan validasi server. |
| Rate limit per NIM, IP terhash, dan sesi | Mengurangi brute force/banjir request. | IP dapat dipakai bersama atau berubah. Jangan menjadikannya larangan absolut. |
| Device signal/fingerprint terhash | Menandai pola risiko untuk ditinjau. | Tidak akurat, mudah berubah/dibypass, dan memerlukan pemberitahuan privasi. Tidak boleh menjadi satu-satunya dasar penolakan. |
| CAPTCHA adaptif | Menahan otomasi ketika ada indikator risiko. | Tidak diperlukan untuk semua pemilih agar aksesibilitas terjaga. |
| Audit log dan monitor anomali | Membantu investigasi setelah kejadian. | Perlu admin yang menindaklanjuti. |

Rekomendasi penting: untuk jaminan "satu orang satu suara" yang lebih kuat, tambahkan faktor kepemilikan terverifikasi, misalnya login SSO kampus atau OTP ke kontak yang telah dimiliki panitia. Fingerprint browser dan IP tidak dapat membuktikan identitas seseorang dan tidak boleh dipasarkan sebagai pencegah kecurangan yang pasti.

## Privasi dan retensi

- Tampilkan pemberitahuan singkat sebelum verifikasi: NIM dipakai untuk validasi satu suara; IP/sinyal perangkat diproses secara terbatas untuk keamanan.
- Simpan hash bersalt untuk IP dan device signal jika kebutuhan investigasi tidak memerlukan nilai mentah.
- Enkripsi data pribadi saat tersimpan dan gunakan HTTPS di seluruh lingkungan.
- Terapkan least privilege, MFA untuk semua admin, password hashing modern, CSRF protection, validasi input, dan log akses.
- Tetapkan pemilik data serta masa retensi. Default rancangan: hapus/anonimkan sinyal keamanan dan sesi 30 hari setelah hasil disahkan; arsip rekap dan audit mengikuti kebijakan HMP/UNESA yang disetujui.
- Jangan menampilkan NIM, nama, IP, device signal, atau pilihan individual pada halaman publik maupun ekspor operasional biasa.

## Klasifikasi data dan kontrol akses

| Klasifikasi | Contoh | Akses | Kontrol minimum |
| --- | --- | --- | --- |
| Publik | Judul event, calon aktif, hasil live agregat | Semua pengunjung | Cache aman; tanpa PII. |
| Internal terbatas | Count import, status risk agregat, metadata event | Admin | Auth, admin-only policy, audit. |
| PII | NIM, nama, kelas, IP hash yang dapat dikaitkan | Admin terautentikasi | Enkripsi, export control, redaksi log. |
| Sangat terbatas | Relasi voter-calon, alasan void, signal investigasi | Admin sesuai prosedur dua akun | Least privilege, dual approval, audit tambahan. |
| Rahasia | API key, encryption key, token sesi mentah | Runtime/secret manager | Tidak pernah masuk database/log/client. |

## Threat model ringkas

| Ancaman | Contoh | Kontrol pencegahan | Deteksi/respons |
| --- | --- | --- | --- |
| Duplicate vote | Submit paralel atau retry request. | Transaction, unique constraint, idempotency. | Alert konflik/rekonsiliasi. |
| NIM enumeration | Bot mencoba banyak NIM. | Pesan generik, rate limit, challenge adaptif. | Metrik invalid attempt per sumber. |
| Impersonasi | Seseorang memakai NIM teman. | Faktor kedua bila tersedia, session pendek, review anomali. | SOP sengketa tanpa membuka pilihan. |
| Abuse admin | Mengubah calon/periode atau eksport data. | Admin-only policy, MFA, approval dua akun, immutable audit. | Alert aksi privileged dan log review. |
| Data exfiltration | PII masuk analytics, screenshot, log, URL. | Data minimization, allowlist telemetry, redaction. | Scan log/export dan incident process. |
| Denial of service | Traffic lonjakan saat masa voting singkat. | CDN/cache publik, rate limit, queue, capacity test. | Status page dan monitoring latency/error. |

## Kebijakan token dan hashing

- Token sesi/receipt dibuat dengan sumber acak kriptografis; token mentah hanya ditampilkan sekali bila perlu dan tidak dicatat log.
- Session cookie memakai `HttpOnly`, `Secure`, `SameSite` sesuai alur, TTL pendek, dan rotasi setelah verifikasi.
- IP/device signal memakai HMAC/hash bersalt dengan secret runtime dan version marker; jangan gunakan hash polos yang mudah dicocokkan ulang.
- Password admin memakai password hashing modern dari provider auth, bukan enkripsi reversibel atau hash manual.
- Semua compare secret menggunakan primitive aman dari library/platform yang dipilih.

## Logging, monitoring, dan respons keamanan

Log keamanan mencatat kategori kejadian, actor/pseudonymous identifier, request ID, status, dan waktu; ia tidak mencatat NIM mentah, token, body vote, atau pilihan calon. Dashboard operasional memantau error rate, latency verify/submit, hasil konflik unique, volume CAPTCHA, queue lag, dan revision realtime. Ambang alert ditentukan setelah load test; alert memicu SOP `09-sop-panitia.md`, bukan pemblokiran massal otomatis.
