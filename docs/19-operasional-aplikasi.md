# 19. Operasional Aplikasi yang Terimplementasi

Dokumen ini menjelaskan perilaku aplikasi **saat ini**, bukan rancangan target. Semua konfigurasi dan operasi berikut mengikuti `00-pedoman-eksekusi-berbasis-md.md` serta dicatat pada `16-log-eksekusi.md`.

## Batas implementasi

- Aplikasi memakai Next.js, SQLite lokal/persistent, dan dua role: `visitor` serta `admin`.
- Satu event `pgsd-2026` tersedia dengan state `scheduled`, `open`, dan `closed`; keadaan awal selalu `scheduled` dan hasil tersembunyi.
- Sembilan calon diambil dari katalog `src/lib/site.ts` dan poster pada `public/paslon/`. Poster ditampilkan pada rasio asli tanpa crop.
- Master peserta masuk melalui unggahan XLSX oleh admin; spreadsheet sumber tidak pernah dibaca langsung oleh visitor dan tidak diubah oleh aplikasi.
- Reset yang tersedia adalah **Reset pra-voting**: hanya ketika event belum `open` dan belum ada suara sah. Ia menghapus master peserta dan sesi verifikasi, mengembalikan status ke `scheduled`, menyembunyikan hasil, serta mempertahankan calon dan audit. Suara sah tidak mempunyai tombol hapus.
- Sistem belum menyediakan pemilihan ulang dengan event baru, MFA, SSO/OTP kampus, CAPTCHA, maupun ekspor arsip. Kebutuhan itu tetap berada pada dokumen rancangan dan memerlukan entry eksekusi baru sebelum ditambahkan.

## Prasyarat server

| Kebutuhan | Ketentuan |
| --- | --- |
| Node.js | Versi `22.13.0` atau lebih baru; dibutuhkan untuk `node:sqlite`. |
| Storage | Direktori aplikasi harus dapat ditulis untuk local. Di server, atur `VOTING_DB_PATH` ke path absolut pada volume persistent. |
| HTTPS | Wajib untuk deployment publik agar cookie admin dikirim sebagai `Secure`. |
| `VOTING_TOKEN_SECRET` | Minimal 32 karakter; dipakai untuk membungkus hash token voting dan merupakan syarat membuka event. |
| `ADMIN_BOOTSTRAP_TOKEN` | Minimal 16 karakter; hanya digunakan untuk membuat akun admin pertama. |

Jangan commit `.env.local`, database SQLite, token bootstrap, kata sandi, atau hasil ekspor. File ini hanya menyimpan instruksi tanpa rahasia.

## Setup pertama kali (local)

1. Jalankan `npm install`.
2. Jalankan `npm run setup:local` sekali. Script membuat `.env.local` dengan dua secret acak dan **menolak menimpa** file yang sudah ada.
3. Jalankan `npm run dev`.
4. Buka `/panitia/login`, lalu buat username admin, kata sandi minimal 12 karakter, dan masukkan nilai `ADMIN_BOOTSTRAP_TOKEN` dari `.env.local`.
5. Masuk ke `/panitia`, sinkronkan materi calon bila katalog diubah, lalu cek status publikasi setiap calon.
6. Unggah spreadsheet XLSX peserta. Parser mencari header `NIM`, `NAMA`, `KELAS`, dan opsional `TTD` pada setiap sheet; NIM dinormalisasi sebagai digit dan duplikasi/format salah menggagalkan seluruh import.
7. Cek jumlah peserta dan daftar internal. Keputusan siapa yang eligible harus disahkan panitia sebelum event dibuka; implementasi saat ini menganggap seluruh baris valid dari spreadsheet sebagai eligible.
8. Tetapkan kebijakan hasil: sembunyikan, tampilkan langsung, atau tampilkan setelah event ditutup.
9. Klik **Buka voting** hanya setelah UAT panitia selesai. Server menolak pembukaan jika secret tidak ada, peserta belum diimpor, atau calon published kurang dari dua.

## Alur visitor yang berjalan

1. Visitor masuk ke `/vote` ketika event `open`.
2. Visitor memasukkan NIM. API menerapkan batas lima percobaan per alamat jaringan dalam sepuluh menit dan selalu memberi pesan gagal yang generik.
3. Jika NIM eligible dan belum memiliki vote, server mengeluarkan token sesi opaque yang berlaku sepuluh menit.
4. Visitor memilih satu calon, memeriksa ringkasan, kemudian mengirim.
5. Server memvalidasi ulang state event, token, calon published, dan menjalankan transaksi SQLite dengan constraint `UNIQUE(election_id, voter_id)`.
6. Hanya commit pertama per NIM yang dapat diterima. Idempotency key mengembalikan receipt sama untuk retry request yang identik; browser tidak menyimpan NIM, token, ataupun pilihan sebagai sumber data permanen.
7. Receipt menampilkan hanya kode acak dan waktu penerimaan, tanpa NIM atau calon terpilih.

IP digunakan hanya untuk rate limit dalam bentuk hash. Sistem tidak mengklaim memakai fingerprint biometrik/perangkat sebagai identitas pemilih.

## Pengalaman visual publik

Beranda memakai scene hutan CSS/Motion dengan progress scroll, horizon berlapis, reveal section, ticker dekoratif, daun animatif, dan respons pointer desktop. Kartu kandidat menambahkan spotlight serta tilt ringan tanpa mengubah atau men-crop poster sumber. Efek ini berada di `/` saja; `/vote`, receipt, dan panel admin tidak memakai dekorasi yang dapat mengganggu proses. Semua efek dimatikan atau disederhanakan oleh `prefers-reduced-motion` dan tidak menyimpan input pointer.

## Operasi admin

| Tindakan | Pengaman implementasi |
| --- | --- |
| Login | Password `scrypt`, cookie `httpOnly`, `sameSite=lax`, sesi 8 jam, dan batas 10 percobaan username per 15 menit. |
| Import peserta | Hanya sebelum voting dibuka atau suara tersimpan; import mengganti master peserta dalam satu transaksi. |
| Lihat peserta | Halaman `/panitia` menampilkan NIM, nama, kelas, marker TTD, eligibility, dan status sudah/belum memilih. Ia tidak menampilkan pilihan calon. |
| Kandidat | Sinkron katalog dan ubah published hanya sebelum event `open`; pembukaan event membutuhkan minimal dua calon published. |
| Voting on/off | `open` hanya setelah seluruh prasyarat; `closed` langsung menolak verifikasi dan submit baru. |
| Hasil | Rekap publik hanya agregat dan mengikuti visibility yang dipilih admin. |
| Reset pra-voting | Memerlukan alasan minimal delapan karakter dan kata konfirmasi `RESET`; ditolak bila `open` atau sudah ada suara sah. |
| Audit | Bootstrap admin, status event, visibility, import, kandidat, sinkron katalog, dan reset dicatat dengan waktu serta ringkasan aman. |

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
