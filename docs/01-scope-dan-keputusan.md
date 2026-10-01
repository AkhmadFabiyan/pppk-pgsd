# 01. Ruang Lingkup dan Keputusan

## Tujuan

Menyediakan website voting yang responsif untuk pemilihan Ketua Angkatan PGSD 2026. Setiap mahasiswa hanya dapat mengirim satu suara, hasil dapat dipantau secara langsung sesuai kebijakan publikasi, dan panitia dapat mengaudit seluruh proses.

## Fakta referensi

- Proposal PPPK menyebut sasaran kegiatan: mahasiswa baru S1 PGSD FIP UNESA angkatan 2026.
- Agenda PPPK Day 4 memuat orasi kandidat pukul 10.20-11.20 WIB dan pemilihan ketua angkatan pukul 11.20-11.40 WIB pada 26 September 2026. Pada sistem yang dirancang, satu pilihan surat suara adalah satu calon individu.
- Spreadsheet absensi berisi 437 NIM unik dalam kelas A-L; 425 baris memiliki tanda hadir dan 12 belum bertanda hadir.

Tanggal pada proposal sudah berlalu terhadap tanggal penyusunan dokumen ini. Karena itu, waktu buka/tutup voting tidak boleh memakai tanggal proposal secara otomatis; admin wajib menetapkan jendela voting baru pada konfigurasi event.

## In scope

- Halaman publik: informasi pemilihan, calon individu, tata cara, status periode, dan hasil live yang telah diizinkan.
- Verifikasi pemilih dengan NIM yang cocok dengan master peserta.
- Satu suara final untuk satu NIM.
- Pemilihan satu calon dan halaman konfirmasi yang jelas sebelum suara dikunci.
- Dasbor admin untuk calon, periode, hasil, ekspor, dan audit.
- Pembaruan hasil live setelah suara sah tersimpan.
- Impor master peserta dari spreadsheet dan ekspor daftar pemilih/suara untuk panitia.
- Tampilan mobile-first dengan tema hutan hijau dan aksen merah.

## Di luar scope versi pertama

- Aplikasi native.
- Autentikasi SSO kampus, OTP SMS/WhatsApp, dan integrasi sistem akademik; ini dapat menjadi peningkatan setelah persetujuan akses dan biaya.
- Pengambilan biometrik, lokasi presisi, atau pemblokiran otomatis berbasis IP/fingerprint.

## Keputusan yang perlu panitia tetapkan

| Keputusan | Opsi / dampak |
| --- | --- |
| Hak pilih | Semua 437 NIM pada master, atau hanya 425 peserta bertanda hadir. Default rancangan: semua peserta master dapat diverifikasi, karena spreadsheet adalah absensi, bukan daftar hak pilih formal. |
| Calon | Nomor urut, nama, foto resmi, visi-misi, kelas sumber, serta urutan tampil. Rincian input ada di `11-setup-calon-individu.md`. |
| Periode | Zona waktu WIB, waktu buka, waktu tutup, serta apakah suara dapat dipublikasikan sebelum ditutup. |
| Hasil live | Publik: jumlah suara dan persentase setiap calon, total suara sah, serta tingkat partisipasi diperbarui selama periode voting. Panitia menerima risiko bahwa angka live dapat memengaruhi pilihan pemilih berikutnya. |
| Admin | Minimal dua akun admin aktif untuk pemisahan tindakan sensitif dan prosedur jika ada sengketa. |

## Kriteria sukses

- NIM yang tidak ada di master tidak dapat memilih.
- NIM yang telah memiliki suara final tidak dapat memilih kembali.
- Suara tersimpan atomik, dapat diaudit, dan total hasil konsisten dengan data suara sah.
- Semua halaman utama nyaman digunakan di layar 320 px sampai desktop.
- Admin dapat mengunduh data pemilih dan rekap hasil tanpa mengekspos pilihan individu ke publik.

## Kebutuhan nonfungsional

| ID | Kebutuhan | Batas keberhasilan |
| --- | --- | --- |
| NFR-01 | Responsif | Alur voting utuh dapat diselesaikan pada layar 320 px, 375 px, tablet, dan desktop tanpa scroll horizontal. |
| NFR-02 | Integritas | Request paralel, refresh, tombol submit ganda, dan retry jaringan tidak dapat menciptakan dua suara sah. |
| NFR-03 | Ketersediaan | Jika realtime gagal, penyimpanan suara tetap berjalan dan hasil menggunakan fallback polling. |
| NFR-04 | Privasi | PII tidak ada pada URL, analytics publik, payload realtime publik, error client, atau screenshot dashboard publik. |
| NFR-05 | Aksesibilitas | Keyboard, pembaca layar, contrast, focus state, dan reduced motion didukung pada alur esensial. |
| NFR-06 | Auditabilitas | Aksi konfigurasi, impor, eksport, pembukaan/penutupan, dan koreksi dapat ditelusuri lewat actor, waktu, alasan, dan request ID. |

## Batasan dan asumsi yang dikunci

1. NIM adalah identifier akademik dan selalu diperlakukan sebagai string; aplikasi tidak mengubahnya ke tipe angka.
2. Jam operasional tampilan menggunakan `Asia/Jakarta`/WIB, sementara penyimpanan timestamp menggunakan UTC agar audit konsisten.
3. Hasil live per calon adalah keputusan panitia yang disetujui. Tidak ada mode default yang menyembunyikan jumlah calon setelah event dibuat dengan kebijakan ini.
4. Daftar absensi adalah input awal, bukan bukti formal satu orang satu suara. Pilihan SSO/OTP membutuhkan persetujuan akses, anggaran, dan kebijakan data baru.
5. Visitor tidak membuat akun pada versi pertama; akun hanya untuk role `admin`.

## Register keputusan operasional

| ID | Keputusan | Owner | Deadline | Dampak bila belum selesai |
| --- | --- | --- | --- | --- |
| DEC-01 | Kebijakan eligible: seluruh master atau TTD | Admin yang ditunjuk panitia | Sebelum impor final | Import tidak boleh di-commit. |
| DEC-02 | Calon dan material kampanye | Panitia pemilihan | Sebelum UAT | Bilik suara tidak dapat disahkan. |
| DEC-03 | Buka/tutup WIB dan masa sengketa | Admin yang ditunjuk panitia | Sebelum staging | Event tidak dapat dijadwalkan. |
| DEC-04 | Faktor verifikasi tambahan | Pemilik data/panitia | Sebelum produksi | Risiko impersonasi tetap harus diterima eksplisit. |
| DEC-05 | Retensi arsip dan kontak insiden | HMP/pemilik data | Sebelum produksi | Data tidak boleh dikumpulkan. |

## Tidak boleh dilakukan

- Menambah suara manual, menghapus vote final, atau mengganti calon dari database produksi tanpa prosedur koreksi/audit.
- Menganggap fingerprint browser atau alamat IP sebagai identitas tunggal pemilih.
- Mengirim spreadsheet peserta ke repository publik, layanan analitik, atau channel realtime.
- Membuka voting sebelum daftar eligible, calon, periode, dan admin telah mendapat sign-off.
