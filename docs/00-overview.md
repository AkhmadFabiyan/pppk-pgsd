# Overview Sistem

Sistem memilih satu **calon individu** untuk satu event pemilihan PGSD 2026. Aplikasi hanya memiliki role `visitor` dan `admin`; fungsi review/approval dijalankan oleh akun admin berbeda, bukan role tambahan.

Aliran utama: event disiapkan → master eligible diimpor → calon direview → event dibuka → visitor diverifikasi → satu vote final tersimpan atomik → agregat dipublikasikan sesuai kebijakan → event ditutup dan diarsipkan.

Prinsip inti: data pemilih dan pilihan tidak tampil publik, satu NIM tidak dapat menghasilkan dua vote sah, serta perubahan sensitif memiliki audit dan approval dua admin.
