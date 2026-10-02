# Workflow — Reset dan Pemilihan Ulang

Scope panel memakai dua aksi yang harus berurutan: **Reset suara voting** lalu **Reset peserta**. Reset suara hanya tersedia di local atau Vercel Preview ketika event `is_test`, `APP_ENV=development|preview`, dan flag server-only lulus. Satu transaction menghapus data uji: vote, receipt yang melekat, sesi, serta rate limit voting; peserta, calon, akun admin, dan audit tetap ada.

Setelah jumlah suara `0`, tombol **Reset peserta** aktif. Ia menghapus NIM dan sesi tersisa, tetapi server menolak request langsung jika masih ada vote. Admin memasukkan alasan, konfirmasi teks spesifik, lalu mengirim idempotency key. Preview/production-like reset membutuhkan persetujuan akun admin kedua yang berbeda; local development tetap mencatat audit. Endpoint reset suara tidak tersedia di Production. Event resmi yang sudah memiliki suara mengikuti SOP pemilihan ulang dan tidak mempunyai tombol hapus.

Lihat `../13-reset-dan-pengulangan-event.md` untuk guard, UX, urutan transaction, dan acceptance test.
