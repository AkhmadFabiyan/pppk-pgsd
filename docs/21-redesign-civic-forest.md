# 21. Redesign UI/UX — Civic Forest

## Status dan tujuan

Dokumen ini menjadi amendment visual untuk aplikasi voting PGSD 2026. Tujuannya bukan menambah dekorasi, melainkan membuat pengalaman publik terasa hangat, hidup, dan khas tanpa kehilangan karakter alat pemilihan resmi.

Hasil yang dituju:

- Beranda terasa seperti undangan resmi yang energik: satu adegan hutan editorial, informasi status yang segera terbaca, lalu perjalanan singkat menuju kandidat, proses, dan hasil.
- Bilik suara tetap tenang, fokus, dan cepat; interaksi yang bergerak hanya memberi respons atas pilihan pemilih.
- Layar hasil live terasa seperti papan pengumuman event yang modern dan jelas dari jarak jauh; perubahan jumlah serta perubahan peringkat terlihat tanpa refresh.
- Panel panitia tetap berbentuk workspace fungsional, bukan variasi dari landing page yang penuh dekorasi.

Redesign ini tidak mengubah rute, kontrak API, aturan satu NIM/satu suara, kebijakan hasil, data calon, poster, reset, maupun otorisasi admin.

## Prinsip visual

### Bahasa desain

Nama arahnya adalah **Civic Forest**: warna hutan sebagai pondasi kepercayaan, lumut muda sebagai energi, dan merah bata sebagai penanda keputusan. Karakter visual berasal dari tipografi tegas, komposisi asimetris yang tetap teratur, tekstur garis topografi yang sangat halus, serta bentuk organik berukuran besar—bukan dari glass panel, gradien pelangi, atau ikon dekoratif yang tidak menjelaskan apa pun.

| Area | Karakter | Yang harus dihindari |
| --- | --- | --- |
| Beranda | Editorial, hangat, berlapis, mudah dipindai. | Sekumpulan kartu generik yang semua bentuk dan bayangannya sama. |
| Kandidat | Galeri poster resmi dengan nomor sebagai penanda kuat. | Memotong, mengubah, memberi filter berat, atau mengubah rasio poster. |
| Voting | Diam, jelas, berurutan, berorientasi pada keputusan. | Parallax, angka hasil, efek daun, atau mikroanimasi loop. |
| Hasil live | Kontras tinggi, data pertama, nyaman untuk proyektor. | Poster kecil, chart dekoratif, atau efek yang menyulitkan membaca perubahan. |
| Panitia | Padat, terstruktur, cepat untuk operasi. | Scene hutan, motion loop, atau layout desktop yang dipaksakan ke ponsel. |

### Token dan hierarki

- Bidang gelap: `forest-950`; bidang terang: `bone-50`; garis: hijau abu tipis.
- Aksen hidup: `moss-200`; aksen keputusan/destruktif: `brick-600`. Merah tidak digunakan sebagai warna status normal.
- Gunakan satu heading besar yang nyata per viewport, satu CTA primer per kelompok keputusan, dan label konteks singkat berbentuk `eyebrow`.
- Gunakan angka tabular untuk semua jumlah, peringkat, nomor surat suara, dan status progres.
- Poster menggunakan `height: auto`, tanpa `object-fit: cover`, dan selalu memuat ukuran intrinsik untuk mencegah layout shift.

## Struktur pengalaman

### Beranda `/`

1. **Opening scene** — status event, nama pemilihan, satu CTA, serta kartu fakta periode. Ornamen hutan berada di belakang dan tidak menangkap pointer.
2. **Tiga alasan singkat** — keamanan, materi calon, dan data resmi. Bukan bagian pemasaran; copy menjawab kecemasan pemilih.
3. **Galeri kandidat** — poster, nomor, nama, kelas. Pengguna tidak dapat tidak sengaja memulai voting dari kartu ini.
4. **Jalur empat langkah** — menjelaskan apa yang akan terjadi di bilik suara sebelum pemilih memasukkan NIM.
5. **Rekap** — ringkasan hasil aktual sesuai policy. Jika tertutup, tampilkan kebijakan sebenarnya, bukan data pengganti.
6. **Bantuan dan privasi** — penutup jelas dengan tindakan paling aman.

Pada layar kecil, hero menjadi satu kolom: copy lalu fakta event. Navigasi berubah menjadi menu yang dapat ditutup setelah link dipilih. Semua section memakai gutter minimum 16 px dan tinggi target sentuh minimum 44 px.

### Voting `/vote`

Progress tiga tahap menjadi penunjuk posisi, bukan komponen permainan. Saat NIM berhasil diverifikasi, tahap berikut muncul dari opacity/translate pendek dan fokus bergeser ke heading tahap. Opsi ballot memberi umpan balik terpilih yang dapat dipahami melalui border, ikon cek, dan `aria-checked`, bukan hanya warna. Konfirmasi tetap menjadi momen paling tenang: pilihannya besar, tindakan destruktif/akhir jelas, dan animasi kirim hanya spinner yang jujur.

### Hasil live `/live`

Sembilan tile berada dalam satu viewport untuk layar presentasi normal. Kandidat disortir berdasarkan jumlah suara menurun; angka sama memakai nomor ballot menaik agar tidak berkedip antar-poll. Ketika peringkat berganti, layout bergerak singkat dan nilai yang berubah menerima penekanan singkat. Angka tetap tersedia segera untuk pembaca layar dan reduced motion mematikan perpindahan tersebut.

### Panitia `/panitia`

Workspace dipertahankan sebagai UI terang dengan hirarki tugas berikutnya, readiness, metrik, operasi, daftar peserta, audit, dan zona reset. Pada lebar kecil, tabel berubah menjadi catatan ringkas serta control berbaris vertikal. Hanya disclosure, feedback submit, dan perpindahan section singkat yang dianimasikan.

## Arsitektur motion dan batas performa

### Pembagian teknologi

| Teknologi | Dipakai untuk | Tidak dipakai untuk |
| --- | --- | --- |
| CSS | State statis, token, focus, perubahan hover sederhana, dan fallback. | Menghitung state bisnis atau animasi scroll yang kompleks. |
| Motion for React | Page/section reveal, hover/tap, wizard state, layout peringkat hasil, serta angka hasil dari snapshot server. | Animasi terus-menerus pada form voting atau tiap elemen di halaman. |
| GSAP | Satu timeline pembuka beranda: masuknya horizon, dua elemen copy, dan panel status; parallax dekoratif sangat kecil pada pointer desktop. | Route voting, admin, hasil live, scroll hijacking, ScrollTrigger global, Lenis, atau animasi yang menunda konten. |

GSAP dimuat hanya oleh komponen client hero. Tidak ada Three.js, React Three Fiber, canvas, particle engine, video latar, font besar baru, atau smooth-scroll library. Dengan begitu, route yang penting untuk menyelesaikan vote tidak menanggung JavaScript visual beranda.

### Aturan eksekusi motion

- Semua animasi memakai `transform` dan `opacity`; jangan menganimasikan `width`, `height`, atau posisi layout kecuali layout animation hasil yang dibatasi.
- GSAP wajib dibungkus `gsap.context()` dan dibersihkan pada unmount. Tidak ada listener `scroll` global.
- `prefers-reduced-motion: reduce` membuat hero langsung statis, menyembunyikan daun dekoratif, menonaktifkan pointer parallax, dan menghapus stagger. Informasi yang sama tetap tersedia.
- Pointer effect hanya aktif pada pointer `fine` dan tidak berjalan di touch device.
- Motion reveal memakai `once: true`; tidak memutar ulang saat user scroll naik/turun.
- Semua konten dan CTA dapat dipakai sebelum timeline selesai. Tidak ada opacity 0 pada konten esensial di reduced motion atau saat JavaScript gagal.

| Motion | Durasi | Batas visual |
| --- | --- | --- |
| Hero entrance | 500–800 ms, sekali | 24 px maksimum; tidak memblokir CTA. |
| Hover/tap | 120–180 ms | 2–6 px maksimum; tanpa layout shift. |
| Section reveal | 220–320 ms, sekali | Opacity + translate 16–24 px. |
| Wizard transition | 160–220 ms | Fokus dan state ARIA berubah lebih dulu. |
| Hasil/peringkat | 280–380 ms | Hanya data aktual dan satu snapshot baru. |

## Responsif dan aksesibilitas

| Kondisi | Keputusan desain |
| --- | --- |
| 320–479 px | Satu kolom, typography `clamp`, menu overlay fokus-trap tidak diperlukan karena nav tetap DOM biasa, tombol penuh bila ruang sempit. |
| 480–767 px | Kandidat tetap satu/dua kolom hanya jika poster masih terbaca; hero panel berpindah setelah CTA. |
| 768–1023 px | Kandidat dua kolom, hero dapat dua kolom jika tidak menekan copy, live tetap grid 3×3 rapat. |
| ≥1024 px | Kandidat tiga kolom, hero editorial dua kolom, live 3×3 satu viewport normal. |
| Keyboard, zoom 200%, reader | Satu `h1`, landmark, skip link, focus ring, urutan DOM logis, control semantik, dan fallback scroll jika viewport tidak cukup. |

## Penerimaan redesign

- [ ] Beranda, voting, live, dan admin memiliki hirarki visual yang berbeda sesuai tugasnya namun satu sistem warna dan tipografi.
- [ ] Hero tampak hidup pada desktop normal tanpa library scroll/3D; reduced motion dan perangkat touch tidak menjalankan dekorasi tersebut.
- [ ] Poster kandidat tidak dicrop atau diubah dan tidak terjadi Cumulative Layout Shift saat gambar termuat.
- [ ] `/vote` tidak memiliki animasi loop, hasil live, atau efek berat; vote dapat diselesaikan dengan keyboard dan layar kecil.
- [ ] `/live` menampilkan semua calon dan hasil aktual tanpa refresh manual; urutan stabil untuk tie dan berubah halus untuk data baru.
- [ ] Build produksi, typecheck, lint, dan diff check lulus; bundle baru diperiksa agar GSAP tidak masuk ke route voting/admin/live.
- [ ] Review visual pada lebar 320, 768, 1024, dan 1440 px dilakukan sebelum pekerjaan ditutup.

## Keputusan lanjutan

Penggunaan GSAP adalah pengecualian terbatas terhadap kontrak sebelumnya di `04-ui-ux-dan-visual.md`. Ketika hero tidak lagi terasa lebih baik secara nyata pada review, hapus GSAP sebelum deployment daripada menambah efek lain untuk membenarkannya.
