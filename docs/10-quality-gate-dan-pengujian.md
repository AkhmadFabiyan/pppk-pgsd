# 10. Quality Gate dan Pengujian

## Definition of ready

Implementasi hanya dimulai setelah panitia memberikan daftar calon individu, kebijakan daftar pemilih, periode voting WIB, minimal dua akun admin, kebijakan hasil, persetujuan privasi, dan pilihan faktor autentikasi tambahan bila diperlukan.

## Matriks acceptance

| ID | Skenario | Bukti lulus |
| --- | --- | --- |
| VOT-01 | NIM eligible pertama kali memilih | Satu vote sah, receipt tampil, rekap naik satu. |
| VOT-02 | Dua submit paralel dari NIM sama | Tepat satu vote sah; lainnya `already_voted` atau respons idempoten. |
| VOT-03 | Retry setelah browser timeout | Receipt/vote pertama ditemukan, tidak ada suara kedua. |
| VOT-04 | NIM tidak ada atau tidak eligible | Tidak bisa memperoleh sesi vote; pesan tidak membocorkan peserta lain. |
| VOT-05 | Periode belum buka/sudah tutup | Server menolak meski UI stale atau waktu browser dimanipulasi. |
| VOT-06 | Calon dinonaktifkan | Tidak dapat dipilih pada submit server. |
| DEV-01 | Device A sudah vote dengan NIM A lalu mencoba NIM B | Vote kedua ditolak secara generik oleh device binding; tidak ada PII bocor. |
| DEV-02 | Dua HP berbeda memakai Wi-Fi/IP publik yang sama | Kedua vote sah bila NIM dan faktor lain valid; IP tidak menjadi unique constraint. |
| DEV-03 | Reset suara voting pada event device-integrity | Vote/receipt/dua claim browser/sesi/rate limit `vote.*` terhapus bersama, audit reset tetap ada. |
| RES-02 | Suara baru masuk saat `/live` dan beranda terbuka | Angka agregat berubah tanpa reload dalam maksimal satu interval polling; tidak ada PII pada respons. |
| LIV-02 | Jumlah suara kandidat berubah pada `/live` | Kartu otomatis terurut `voteCount` menurun; tie memakai nomor urut menaik; perpindahan tidak mengganggu reduced motion. |
| RES-01 | Visibility `turnout_only` | Endpoint dan realtime publik tidak memuat total per calon. |
| ADM-01 | Visitor membuka rute admin | Ditolak/diarahkan ke login tanpa data admin terbuka. |
| ADM-02 | Admin mencoba edit calon saat open | Ditolak dan tercatat audit. |
| ADM-03 | Admin mereset peserta saat masih ada vote | Ditolak tanpa mengubah peserta dan menjelaskan bahwa reset suara harus dilakukan lebih dahulu. |
| ADM-04 | Admin mereset suara dengan alasan dan konfirmasi yang tepat | Vote/receipt/claim browser/sesi/rate limit dihapus, event menjadi `scheduled`, peserta tetap ada, dan audit tercatat. |
| IMP-01 | Spreadsheet punya NIM duplikat | Preview gagal/menandai baris sebelum commit. |
| SEC-01 | PII pada respons/event/log publik | Test snapshot memastikan tidak ada NIM, nama, IP, token, atau pilihan calon personal. |
| A11Y-01 | Keyboard dan reduced motion | Semua form/konfirmasi dapat selesai tanpa mouse dan animasi esensial mati. |
| VIS-02 | Isolasi motion dan GSAP | GSAP hanya termuat/berjalan pada hero beranda; route vote, admin, dan live tidak memiliki GSAP atau loop dekoratif. |
| VIS-03 | Redesign responsif | Hierarki dan poster asli tetap terbaca pada lebar 320, 768, 1024, dan 1440 px; tidak ada crop poster atau horizontal overflow. |

## Strategi test

- Unit: state machine event, normalisasi NIM, eligibility, hash/redaction, receipt, visibility hasil, dan schema validasi.
- Integration database: FK, unique constraint vote, transaksi concurrent, idempotency, void approval, serta query agregat.
- API: status code, auth visitor/admin, CSRF, rate-limit behavior, cache-control, redaksi PII, dan error contract.
- E2E: jalur pemilih serta panitia di Chrome/Edge/Safari; jaringan lambat/offline/refresh/back navigation.
- Load: simulasi jumlah pemilih serentak yang melebihi proyeksi dan fokus pada endpoint verify/submit/hasil. Tetapkan target dari keputusan kapasitas, bukan angka asumsi.
- Security: dependency scan, secret scan, SAST, vulnerability review, session/cookie hardening, abuse-case review, dan penetration test proporsional sebelum event.
- Device integrity: uji cookie atau local storage yang dihapus sendiri, keduanya dihapus, mode privat, IP berpindah, perangkat berbeda pada Wi-Fi sama, conflict claim, dan reset; jangan menyimpulkan token browser membuktikan identitas fisik.
- Visual: 320, 375, 768, 1024, 1440 px; portrait/landscape; light/dark bila tersedia; kontras WCAG AA minimum untuk teks dan kontrol.

## Gate per tahap

| Gate | Kriteria non-negosiasi |
| --- | --- |
| Data | Import preview, NIM sebagai string, unique NIM, count approved. |
| Vote integrity | Transaction + unique constraint + idempotency teruji. |
| Device integrity (bila diaktifkan) | Device binding atomik tanpa OTP, Wi-Fi bersama, redaksi hash, dan reset diuji menurut `DEV-*`. |
| Privacy | Data minimization, redaksi log, notice, admin-only policy, retensi, dan export control ditinjau. |
| UX | Mobile, keyboard, screen reader labels, error recovery, reduced motion. |
| Operasional | Monitoring, backup-restore drill, incident SOP, owner on-call, UAT sign-off. |
| Release | Migrasi reviewed, environment production verified, rollback documented, perubahan dikunci. |

## Definition of done

- Semua acceptance ID di atas lulus pada staging dengan bukti yang tersimpan.
- Tidak ada temuan kritis/tinggi keamanan terbuka yang relevan dengan scope.
- Panitia telah melakukan UAT dan menandatangani konfigurasi final.
- Rekonsiliasi hasil, ekspor, audit, retensi, dan SOP pasca-event dapat dijalankan oleh personel non-developer.

## Dataset uji dan isolasi lingkungan

| Dataset | Isi | Larangan |
| --- | --- | --- |
| `fixture-small` | 2 calon, 5 voter eligible, 1 non-eligible, 1 duplicate NIM. | Tidak memakai nama/NIM peserta nyata. |
| `fixture-concurrency` | Minimal satu voter dan banyak request submit paralel. | Tidak mem-bypass service/constraint. |
| `fixture-import` | Header salah, TTD kosong, NIM leading zero, duplikat lintas sheet, formula/error cell. | Tidak mengubah file sumber production. |
| `fixture-load` | Distribusi request verify/submit/hasil yang realistis. | Tidak diarahkan ke production tanpa approval. |
| `fixture-visual` | Calon/foto placeholder aman, strings panjang, kondisi zero/hasil besar. | Tidak menyimpan PII dalam screenshot publik. |

Staging tidak menerima spreadsheet peserta asli kecuali pemilik data menyetujui prosedur khusus. Data production tidak pernah dicopy ke local development secara informal.

## Acceptance tambahan

| ID | Skenario | Bukti lulus |
| --- | --- | --- |
| RES-02 | Mode `full_live` | REST, realtime, dan tabel aksesibel menampilkan count/percent yang sama untuk seluruh calon. |
| RES-03 | Event realtime terlewat | Klien mendeteksi revision lompat lalu refetch snapshot tanpa menampilkan total salah. |
| LIV-01 | Layar hasil live satu viewport | Sembilan calon published tampil dengan count aktual tanpa scroll pada 1024 × 768 dan zoom 100%; layar kecil tetap aksesibel dengan fallback scroll. |
| API-01 | Idempotency key sama | Retry payload sama mengembalikan receipt awal; payload berbeda mendapat conflict. |
| API-02 | Header/cache | Vote/verify/admin memakai `no-store`; public scoreboard tidak mengirim PII. |
| DAT-01 | NIM leading zero | Nilai tidak berubah sepanjang parse/import/query/export. |
| DAT-02 | Candidate/voter lintas event | Insert ditolak dan audit mencatat kegagalan domain. |
| DAT-03 | Event pengganti | Memiliki ID/slug baru dan lineage ke event lama; vote/receipt lama tidak ikut tersalin. |
| SEC-02 | XSS konten calon | HTML/script berbahaya disanitasi atau ditolak sebelum publikasi. |
| SEC-03 | Unauthorized export | Visitor atau admin tanpa sesi valid tidak dapat membuat atau mengunduh export. |
| OPS-01 | Realtime provider down | Vote accepted dan rekap REST tetap benar; UI masuk fallback polling. |
| OPS-02 | Restore drill | Backup staging dipulihkan dan rekap checksum sama dengan sumber. |
| PERF-01 | Lonjakan voting | P95 verify/submit dan error rate memenuhi target yang disetujui load test. |
| VIS-01 | WebGL/reduced motion unavailable | Halaman lengkap tanpa canvas dan fokus/form tetap dapat digunakan. |

## Metode pengujian konkurensi

1. Buat satu voter eligible dan satu calon aktif dalam event open pada database test yang bersih.
2. Kirim banyak request submit paralel dengan sesi valid dan variasi idempotency key; ulangi dengan key sama.
3. Assert tepat satu `Vote` sah, satu receipt canonical, dan semua respons lain `already_voted` atau replay idempoten.
4. Assert agregat calon/total naik tepat satu dan audit tidak mengandung PII/token mentah.
5. Jalankan terhadap database engine yang sama dengan production, bukan hanya mock/in-memory store.

## Quality signal dan exit evidence

| Signal | Bukti | Penanggung jawab |
| --- | --- | --- |
| Code health | Lint, formatting, typecheck, dependency/license scan. | Developer. |
| Integrity | Unit/integration concurrent results dan database migration review. | Developer + admin review. |
| Public UX | E2E, responsive screenshot, keyboard/reduced-motion checklist. | QA. |
| Security/privacy | Threat-model review, secret scan, auth/admin-policy/export evidence. | Security/pemilik data. |
| Operations | Load report, health/alert evidence, backup restore, tabletop incident. | Teknis + admin penanggung jawab. |
| Sign-off | Decision register, UAT signature, config snapshot checksum. | Admin penanggung jawab panitia. |

## Release freeze

Mulai dari waktu yang ditetapkan sebelum event open, perubahan production dibatasi pada perbaikan SEV-1/SEV-2 yang disetujui admin penanggung jawab. Tidak ada penggantian dependency, perubahan animasi besar, perubahan calon, atau migration tanpa rollback review. Setelah event ditutup, archive build/version, database migration state, config snapshot, export checksum, dan incident log untuk kebutuhan audit.
