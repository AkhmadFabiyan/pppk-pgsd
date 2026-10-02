# UI — Section Kandidat `/#kandidat`

Memuat satu card per Candidate `published`: nomor urut, nama, kelas, dan poster resmi. Urutan dari `ballot_number`; jangan gunakan angka nama file aset.

Card menggunakan elemen `article`, bukan link atau tombol. Poster mempertahankan rasio sumber tanpa crop, pembeda kandidat tidak hanya warna, dan motion hanya berupa reveal saat masuk serta hover ringan. Tidak ada detail, modal, atau panel visi-misi untuk visitor. Empty state menjelaskan kandidat belum dipublikasikan; tidak mengungkap draft.

Kolom `vision` dan `missions` tetap dikelola sebagai materi katalog internal untuk sinkronisasi admin; keduanya tidak dirender pada galeri publik.
