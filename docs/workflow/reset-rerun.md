# Workflow — Reset dan Pemilihan Ulang

Scope panel memakai dua aksi yang harus berurutan: **Reset suara voting** lalu **Reset peserta**. Reset suara tersedia bagi admin yang sudah login tanpa konfigurasi environment tambahan. Satu transaction menghapus vote, receipt yang melekat, sesi, serta rate limit voting; peserta, calon, akun admin, dan audit tetap ada.

Setelah jumlah suara `0`, tombol **Reset peserta** aktif. Ia menghapus NIM dan sesi tersisa, tetapi server menolak request langsung jika masih ada vote. Admin memasukkan alasan dan konfirmasi teks spesifik; setiap aksi dicatat pada audit. Event resmi yang sudah memiliki suara juga mengikuti alur ini bila admin memutuskan meresetnya; calon dan audit tetap tidak dihapus.

Lihat `../13-reset-dan-pengulangan-event.md` untuk guard, UX, urutan transaction, dan acceptance test.
