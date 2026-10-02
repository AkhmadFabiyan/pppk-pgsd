# 22. Microcopy dan Nada Bahasa

## Tujuan

Microcopy membantu orang mengambil tindakan berikutnya dengan cepat dan yakin. Pada voting, ia harus mengurangi keraguan tanpa memberi janji yang tidak dapat dibuktikan sistem.

Dokumen ini berlaku untuk semua teks UI yang langsung dibaca visitor atau admin: label, tombol, hint input, status, empty state, error aman, konfirmasi, receipt, dan pembaruan hasil. Ia tidak mengubah teks resmi calon, data spreadsheet, audit log, kontrak API, maupun error internal server.

## Suara produk

**Hangat, ringkas, dan tegas.** Aplikasi berbicara seperti panitia yang siap membantu, bukan seperti materi promosi atau dokumen teknis.

| Lakukan | Hindari |
| --- | --- |
| Mulai dengan tindakan atau keadaan aktual: `Masukkan NIM`, `Voting ditutup`. | Pembuka generik: `Selamat datang`, `Anda akan diarahkan`. |
| Satu pesan menjawab satu pertanyaan: apa yang terjadi dan apa langkah berikutnya. | Satu paragraf memuat alasan, kebijakan, dan beberapa tindakan sekaligus. |
| Gunakan kata kerja spesifik pada CTA: `Pilih calon`, `Kirim suara`, `Buka voting`. | CTA abstrak: `Lanjutkan`, `Proses`, `Klik di sini` bila tujuan belum jelas. |
| Tulis kepemilikan dengan `NIM-mu`, `pilihanmu`, `suaramu` pada visitor. | Bahasa kaku atau menyalahkan: `Data tidak valid`, `Anda gagal`. |
| Nyatakan keterbatasan jujur: `Belum ada hasil yang dipublikasikan`. | Menebak status, mengklaim suara masuk sebelum receipt, atau membingungkan `gagal` dengan `belum diverifikasi`. |

## Aturan penulisan

1. Judul maksimal sekitar 6 kata; body utama maksimal dua kalimat pendek kecuali notice privasi atau reset.
2. Tombol memakai verba + objek bila ruang memungkinkan: `Lihat calon`, `Kirim suara`, `Impor peserta`. Tombol destruktif tetap eksplisit: `Reset suara voting`.
3. Hint input menjelaskan alasan hanya bila membantu keputusan. Detail pengaman browser cukup satu kalimat; jangan membuat klaim fingerprint, identitas perangkat, atau anonimitas absolut.
4. Pesan gagal menyebut keadaan aman dan satu langkah pemulihan; tidak membocorkan NIM, nama, pilihan, receipt, IP, maupun pemilih lain.
5. Hasil menggunakan jumlah, tanggal snapshot, dan status koneksi aktual. Label waktu menggunakan `Pembaruan terakhir` atau `Snapshot terakhir`, bukan `Live` bila polling sedang tertunda.
6. Admin memakai bentuk operasional: kondisi → dampak → tindakan. Jelaskan kunci/risiko sebelum aksi, bukan sesudahnya.
7. Jangan memakai emoji sebagai satu-satunya sinyal, jargon teknis, kata `demo`, atau metafora hutan pada form, error, receipt, admin, dan hasil.

## Pola per state

| Situasi | Judul/microcopy | Tindakan |
| --- | --- | --- |
| Voting terjadwal | `Voting belum dibuka` — `Jadwal akan diumumkan panitia.` | `Lihat calon` |
| Voting terbuka | `Gunakan satu suaramu` — `Siapkan NIM sebelum mulai.` | `Mulai voting` |
| Verifikasi | `Masukkan NIM` — `Gunakan NIM milikmu sendiri.` | `Cek NIM` |
| NIM sudah memilih | `Suaramu sudah tercatat` — `Periksa kode bukti atau hubungi panitia bila perlu.` | `Kembali` |
| Pilihan calon | `Pilih satu calon` — `Kamu masih bisa mengubahnya sebelum mengirim.` | `Lanjut ke konfirmasi` |
| Konfirmasi | `Cek pilihanmu` — `Setelah dikirim, pilihan tidak bisa diubah.` | `Kirim suara` |
| Suara diterima | `Suaramu diterima` — `Simpan kode bukti ini.` | `Kembali ke beranda` |
| Hasil tertunda | `Pembaruan tertunda` — `Menampilkan snapshot terakhir.` | Tidak perlu CTA. |
| Hasil tertutup | `Hasil belum dipublikasikan` — `Panitia akan membuka rekap sesuai kebijakan.` | Tidak perlu CTA. |
| Reset admin | `Reset suara voting` — `Langkah ini mengosongkan suara dan kode bukti.` | `Reset suara voting` |

## Batas dan aksesibilitas

- Teks status yang berubah memakai `aria-live="polite"` hanya untuk ringkasan perubahan; jangan mengumumkan seluruh tabel hasil setiap polling.
- Label form selalu terlihat dan tidak digantikan placeholder. Error muncul di dekat field/aksi terkait.
- Saat reduced motion aktif, teks tidak boleh hanya muncul setelah animasi selesai.
- Gunakan Bahasa Indonesia konsisten, dengan `WIB` untuk waktu hasil. Nama kandidat, NIM, kode receipt, dan label resmi event tidak diubah.

## Checklist penerapan

- [x] Visitor memahami status voting dan CTA berikutnya tanpa membaca paragraf panjang.
- [x] Bilik suara menggunakan bahasa singkat, netral, dan tidak memberi kepastian sebelum receipt.
- [x] Error verifikasi menyatakan pemulihan tanpa mengungkap data pemilih.
- [x] Hasil menjelaskan perbedaan pembaruan aktif, final, dan snapshot terakhir.
- [x] Admin melihat dampak aksi berisiko sebelum submit.
- [x] Tidak ada teks resmi calon, PII, kontrak API, atau audit log yang diubah oleh pekerjaan microcopy.
