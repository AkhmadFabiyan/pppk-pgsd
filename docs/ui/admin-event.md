# UI — Admin Event Workspace

Build saat ini menampilkan status event, jumlah peserta eligible, suara diterima, admin aktif, visibility hasil, daftar kandidat, audit ringkas, serta aksi buka/tutup. `open` hanya dapat dilakukan setelah secret token tersedia, peserta sudah diimpor, dan minimal dua calon published. Tindakan dicatat pada audit.

Saat `open`, publikasi/sinkronisasi kandidat dan import peserta terkunci. Reset yang tersedia hanya pra-voting; pemilihan ulang event belum diimplementasikan. Lihat `19-operasional-aplikasi.md` dan flow rencana `13-reset-dan-pengulangan-event.md`.
