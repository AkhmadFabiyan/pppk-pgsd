# UI — Admin Import, Audit, dan Export

Import XLSX mencari header `NIM`, `NAMA`, `KELAS`, dan opsional `TTD`; validasi format NIM dan duplikasi dilakukan sebelum transaksi penggantian master. Build saat ini menampilkan daftar internal sampai 500 baris dan search sederhana sesudah import, tanpa pilihan calon. Preview per-baris/diff serta review admin kedua belum diimplementasikan.

Export belum diimplementasikan. Semua route admin `noindex` dan authorization server-side.
