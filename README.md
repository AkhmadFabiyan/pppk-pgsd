# Voting Ketua Angkatan PGSD 2026

Website voting Ketua Angkatan PGSD 2026 berbasis Next.js. Aplikasi memiliki dua role: `visitor` untuk melihat informasi dan menggunakan suara saat event dibuka, serta `admin` untuk konfigurasi operasional.

## Fitur

- Beranda responsif berisi kandidat, visi-misi, panduan, status event, dan hasil agregat sesuai kebijakan publikasi.
- Voting tiga tahap: verifikasi NIM, pilih calon, dan konfirmasi.
- Satu suara final per NIM melalui transaksi PostgreSQL serverless dan constraint unik di database.
- Receipt tanpa NIM maupun pilihan calon.
- Panel panitia untuk import XLSX, daftar peserta internal, kontrol open/close, hasil, kandidat, audit, serta reset suara → reset peserta.

## Menjalankan secara local

Persyaratan: Node.js 24 dan URL PostgreSQL serverless (misalnya integrasi Neon di Vercel).

```bash
npm install
npm run setup:local # lalu isi DATABASE_URL pada .env.local
npm run dev
```

Buka `http://localhost:3000/panitia/login` untuk membuat akun admin pertama. Instruksi setup, batas fitur, dan checklist sebelum membuka event ada di [docs/19-operasional-aplikasi.md](docs/19-operasional-aplikasi.md).

## Keamanan data

File spreadsheet peserta dan folder dokumentasi restricted tidak dilacak oleh Git. Jangan commit `.env.local`, URL database, token, receipt, atau data pemilih.

## Validasi

```bash
npm run typecheck
npm run lint
npm run build
```
