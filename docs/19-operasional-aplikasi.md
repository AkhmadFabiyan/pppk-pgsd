# 19. Operasional Aplikasi yang Terimplementasi

Dokumen ini menjelaskan perilaku aplikasi **saat ini**, bukan rancangan target. Semua konfigurasi dan operasi berikut mengikuti `00-pedoman-eksekusi-berbasis-md.md` serta dicatat pada `16-log-eksekusi.md`.

## Batas implementasi

- Aplikasi memakai Next.js di Vercel, PostgreSQL serverless, dan dua role: `visitor` serta `admin`.
- Satu event `pgsd-2026` tersedia dengan state `scheduled`, `open`, dan `closed`; keadaan awal selalu `scheduled` dan hasil tersembunyi.
- Sembilan calon diambil dari katalog `src/lib/site.ts` dan poster pada `public/paslon/`. Poster ditampilkan pada rasio asli tanpa crop.
- Master peserta masuk melalui unggahan XLSX oleh admin; spreadsheet sumber tidak pernah dibaca langsung oleh visitor dan tidak diubah oleh aplikasi.
- **Reset suara voting** hanya tersedia untuk local/Vercel Preview saat event ditandai sebagai test dan guard environment lulus. Ia menghapus suara uji, receipt, sesi voting, serta rate limit voting; peserta tidak dihapus. Production selalu menolak aksi ini pada server.
- **Reset peserta** hanya aktif setelah jumlah suara `0` dan status event `scheduled`. Ia menghapus daftar NIM serta sesi verifikasi yang tersisa. Calon, materi calon, akun admin, dan audit dipertahankan. Kedua langkah menggunakan alasan serta konfirmasi teks dan dicatat pada audit.
- Sistem juga belum menyediakan MFA, SSO/OTP kampus, CAPTCHA, maupun ekspor arsip. Kebutuhan tersebut memerlukan entry eksekusi baru sebelum ditambahkan.

## Prasyarat server

| Kebutuhan | Ketentuan |
| --- | --- |
| Node.js | Versi `24.x`, sama dengan engine yang dipin pada `package.json` dan runtime Vercel. |
| Database | PostgreSQL serverless dengan URL `DATABASE_URL` (atau `POSTGRES_URL`) yang dapat dijangkau Vercel. Gunakan database berbeda untuk development/preview dan production. |
| HTTPS | Wajib untuk deployment publik agar cookie admin dikirim sebagai `Secure`. |
| `VOTING_TOKEN_SECRET` | Minimal 32 karakter; dipakai untuk membungkus hash token voting dan merupakan syarat membuka event. |
| `ADMIN_INITIAL_USERNAME` | Opsional; default-nya `admin@pppk-pgsd.vercel.app`. Hanya dipakai saat membuat akun admin pertama. |
| `ADMIN_INITIAL_PASSWORD` | Minimal 12 karakter; hanya dibaca server untuk membuat akun admin pertama, lalu disimpan sebagai hash `scrypt` di database. |
| `APP_ENV` | Isi `development` untuk local atau `preview` untuk Vercel Preview bila reset suara uji diperlukan. Jangan isi `production` untuk mengaktifkan reset. |
| `SIMULATION_EVENT_ENABLED` | `true` hanya pada database test. Saat schema berjalan, memberi marker database `is_test` ke event; tidak tersedia di UI admin. |
| `ALLOW_SIMULATION_RESET` | `true` hanya pada local/Preview database test agar tombol reset suara dapat dipakai. Production selalu menolak walaupun variable ini keliru terpasang. |

Jangan commit `.env.local`, URL database, kata sandi, atau hasil ekspor. File ini hanya menyimpan instruksi tanpa rahasia.

## Setup pertama kali (local)

1. Jalankan `npm install`.
2. Jalankan `npm run setup:local` sekali. Script membuat `.env.local` dengan secret voting acak, placeholder `DATABASE_URL`, konfigurasi username admin awal, dan **menolak menimpa** file yang sudah ada.
3. Isi `DATABASE_URL` dengan database development PostgreSQL serverless dan isi `ADMIN_INITIAL_PASSWORD` dengan secret baru minimal 12 karakter. Jangan gunakan database atau password production untuk development.
4. Jalankan `npm run dev`.
5. Buka `/panitia/login`, gunakan username admin awal yang tampil dan password dari `ADMIN_INITIAL_PASSWORD`. Login pertama membuat akun admin dan sesi secara otomatis.
6. Masuk ke `/panitia`, sinkronkan materi calon bila katalog diubah, lalu cek status publikasi setiap calon.
7. Unggah spreadsheet XLSX peserta. Parser mencari header `NIM`, `NAMA`, `KELAS`, dan opsional `TTD` pada setiap sheet; NIM dinormalisasi sebagai digit dan duplikasi/format salah menggagalkan seluruh import.
8. Cek jumlah peserta dan daftar internal. Keputusan siapa yang eligible harus disahkan panitia sebelum event dibuka; implementasi saat ini menganggap seluruh baris valid dari spreadsheet sebagai eligible.
9. Tetapkan kebijakan hasil: sembunyikan, tampilkan langsung, atau tampilkan setelah event ditutup.
10. Klik **Buka voting** hanya setelah UAT panitia selesai. Server menolak pembukaan jika secret tidak ada, peserta belum diimpor, atau calon published kurang dari dua.

## Alur visitor yang berjalan

1. Visitor masuk ke `/vote` ketika event `open`.
2. Visitor memasukkan NIM. API menerapkan batas lima percobaan per alamat jaringan dalam sepuluh menit dan selalu memberi pesan gagal yang generik.
3. Jika NIM eligible dan belum memiliki vote, server mengeluarkan token sesi opaque yang berlaku sepuluh menit.
4. Visitor memilih satu calon, memeriksa ringkasan, kemudian mengirim.
5. Server memvalidasi ulang state event, token, calon published, dan menjalankan transaksi PostgreSQL serverless dengan constraint `UNIQUE(election_id, voter_id)`.
6. Hanya commit pertama per NIM yang dapat diterima. Idempotency key mengembalikan receipt sama untuk retry request yang identik; browser tidak menyimpan NIM, token, ataupun pilihan sebagai sumber data permanen.
7. Receipt menampilkan hanya kode acak dan waktu penerimaan, tanpa NIM atau calon terpilih.

IP digunakan hanya untuk rate limit dalam bentuk hash. Sistem tidak mengklaim memakai fingerprint biometrik/perangkat sebagai identitas pemilih.

## Pengalaman visual publik

Beranda memakai satu scene hutan CSS/Motion yang ringan: progress scroll, horizon berlapis, glow pointer desktop, tujuh daun animatif, reveal section, dan tilt ringan pada kartu kandidat. Elemen dekoratif yang tidak mendukung orientasi (ticker, grain, dan orbit) dihilangkan. Efek ini berada di `/` saja; `/vote`, receipt, dan panel admin tidak memakai dekorasi yang dapat mengganggu proses. Route `/live` adalah layar TV/proyektor khusus tanpa header/footer: ia menampilkan grid jumlah suara semua calon published, polling agregat tiap 10 detik saat event open, serta snapshot final ketika diizinkan. Semua efek dimatikan atau disederhanakan oleh `prefers-reduced-motion` dan tidak menyimpan input pointer.

## Operasi admin

| Tindakan | Pengaman implementasi |
| --- | --- |
| Login | Password `scrypt`, cookie `httpOnly`, `sameSite=lax`, sesi 8 jam, dan batas 10 percobaan username per 15 menit. |
| Import peserta | Hanya sebelum voting dibuka atau suara tersimpan; import mengganti master peserta dalam satu transaksi. |
| Lihat peserta | Halaman `/panitia` menampilkan NIM, nama, kelas, marker TTD, eligibility, dan status sudah/belum memilih. Ia tidak menampilkan pilihan calon. |
| Kandidat | Sinkron katalog dan ubah published hanya sebelum event `open`; pembukaan event membutuhkan minimal dua calon published. |
| Voting on/off | `open` hanya setelah seluruh prasyarat; `closed` langsung menolak verifikasi dan submit baru. |
| Hasil | Rekap publik hanya agregat dan mengikuti visibility yang dipilih admin. Route `/live` memakai endpoint agregat yang sama dan tidak menampilkan apa pun saat visibility tertutup. |
| Reset suara voting | Hanya local/Preview test dengan marker `is_test`, `APP_ENV` yang sesuai, dan `ALLOW_SIMULATION_RESET=true`. Memerlukan alasan minimal delapan karakter dan `RESET SUARA VOTING`; hasilnya kembali disembunyikan dan event menjadi `scheduled`. |
| Reset peserta | Hanya setelah event `scheduled` dan suara `0`. Memerlukan alasan minimal delapan karakter dan `RESET PESERTA`; server menolak jika suara masih ada. |
| Audit | Inisialisasi admin, status event, visibility, import, kandidat, sinkron katalog, dan reset dicatat dengan waktu serta ringkasan aman. |

Setelah akun pertama ada di database, aplikasi selalu memverifikasi password hash pada database. Mengubah `ADMIN_INITIAL_PASSWORD` tidak mengganti password akun yang telah ada dan bukan mekanisme pemulihan akses.

## Perubahan materi calon

1. Ganti/letakkan poster resmi di `public/paslon/` tanpa mengubah rasio asli.
2. Ubah nama, kelas, jalur poster, visi, dan misi di `src/lib/site.ts`.
3. Sebelum voting dibuka dan sebelum ada suara, admin memilih **Sinkronkan materi calon** pada panel. Status published yang telah dipilih tidak diubah oleh sinkronisasi.
4. Tinjau beranda pada desktop dan mobile; jangan pernah menyisipkan NIM calon pada katalog publik.

## Bukti minimum sebelum buka

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- UAT akun admin, import salinan aman, satu verifikasi NIM test, satu vote test pada database test, receipt, tutup voting, visibility hasil, serta penolakan reset setelah ada vote.
- Konfirmasi domain HTTPS, backup database persistent, owner panitia, kebijakan eligible, jadwal, dan kanal dukungan.

Lihat juga `02-alur-voting.md` untuk kontrak bisnis, `03-data-dan-keamanan.md` untuk batas privasi, dan `13-reset-dan-pengulangan-event.md` untuk rancangan prosedur lanjutan yang belum termasuk build ini.
