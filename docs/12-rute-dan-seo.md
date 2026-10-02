# 12. Rute, SEO, dan Google Search Console

## Prinsip

Website visitor memakai satu URL utama agar proses pemilihan mudah dipahami dan tidak memecah informasi menjadi banyak halaman. Konten kandidat, panduan, hasil, bantuan, dan privasi dirender sebagai HTML semantik pada beranda. SEO membantu halaman ditemukan, tetapi tidak dapat menjamin peringkat nomor satu di Google.

## Rute aktif

| URL | Fungsi | Index | Catatan |
| --- | --- | --- | --- |
| `/` | Satu beranda visitor: status, kandidat, visi-misi inline, panduan, hasil, bantuan, dan ringkasan privasi. | Ya | Satu `h1`; section memiliki anchor semantik. |
| `/#kandidat` | Section kandidat dan panel visi-misi inline. | Bagian dari `/` | Tidak memiliki halaman/detail URL sendiri. |
| `/#panduan` | Section langkah voting dan bantuan dasar. | Bagian dari `/` | Konten tetap terbaca tanpa JavaScript. |
| `/#hasil` | Section hasil sesuai kebijakan event. | Bagian dari `/` | Saat hasil belum boleh tampil, gunakan status jujur tanpa angka fiktif. |
| `/#bantuan` dan `/#privasi` | Section bantuan dan ringkasan privasi. | Bagian dari `/` | Tidak meminta atau menampilkan NIM. |
| `/vote` | Verifikasi dan surat suara saat event `open`. | Tidak | Route transaksi; saat belum dibuka harus fail-closed. |
| `/bukti/[receiptCode]` | Receipt individual setelah suara diterima. | Tidak | Tidak menampilkan pilihan/NIM. |
| `/live` | Layar presentasi hasil live/final untuk TV atau proyektor panitia. | Tidak | Tanpa header/footer; hanya merender agregat saat kebijakan hasil mengizinkan. |
| `/panitia/login` | Inisialisasi akun admin pertama atau login admin. | Tidak | Username/password, cookie server-side, dan password awal server-only untuk akun awal. |
| `/panitia` | Operasi panitia: import/master peserta, kandidat, status, hasil, reset suara → reset peserta, dan audit. | Tidak | Admin-only; route menampilkan layar akses bila sesi tidak ada. |
| `/api/vote/verify`, `/api/vote/submit`, `/api/results` | API internal UI voting dan rekap publik yang diizinkan. | Tidak | Tidak masuk sitemap; respons voting selalu `no-store`. |

## Route legacy

Route informasi lama tidak dipertahankan. `/kandidat`, detail kandidat, `/panduan-voting`, `/hasil`, `/tentang-pemilihan`, `/bantuan`, dan `/kebijakan-privasi` harus memberi `404`; navigasi aktif hanya memakai anchor pada `/`.

## Metadata dan canonical

Produksi memakai satu domain HTTPS canonical melalui `NEXT_PUBLIC_SITE_URL`. Jika environment variable belum ditetapkan, local/staging tidak boleh diklaim sebagai domain resmi atau diajukan ke Search Console.

```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "Pemilihan Ketua Angkatan PGSD 2026",
  description: "Informasi calon, panduan, status, dan hasil resmi sesuai kebijakan Pemilihan Ketua Angkatan PGSD 2026.",
  alternates: { canonical: "/" },
};
```

Halaman `/` memiliki satu `h1`, title dan deskripsi unik, landmark `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, serta teks HTML untuk informasi inti. Poster kandidat bukan satu-satunya sumber visi/misi; teks detail inline wajib ikut dirender untuk aksesibilitas dan crawler.

## `robots.txt` dan sitemap

`robots.txt` mengizinkan crawler pada `/`, tetapi menolak `/vote`, `/bukti/`, `/live`, `/panitia/`, `/api/`, dan `/auth/`. Ia bukan pengamanan data; route sensitif tetap wajib mempunyai auth/otorisasi.

`sitemap.xml` hanya memuat canonical `/`. Anchor tidak masuk sitemap karena bukan dokumen mandiri. Rute transaksi, receipt, admin, dataset, dan redirect tidak pernah masuk sitemap.

## Structured data

JSON-LD hanya boleh berisi fakta publik yang sudah disahkan: `WebSite`, dan `Organization`/`Event` setelah identitas penyelenggara serta jadwal final tersedia. Jangan menggunakan schema kandidat individual hanya untuk mengejar rich result, dan jangan memuat NIM, daftar pemilih, hasil individual, atau data internal.

## Setup Search Console setelah domain siap

1. Tetapkan satu domain HTTPS canonical dan deploy beranda publik.
2. Verifikasi Domain Property melalui DNS TXT atau URL-prefix menggunakan token environment variable.
3. Periksa `/` dengan URL Inspection: title, description, canonical, konten HTML, dan robots harus benar.
4. Submit `https://domain-produksi/sitemap.xml`.
5. Jalankan Lighthouse serta Rich Results Test bila JSON-LD digunakan.
6. Jangan meminta indexing untuk vote, receipt, admin, API, ekspor, atau data peserta.

## Quality gate SEO

- [ ] `/` memberi status `200`, memiliki satu `h1`, canonical HTTPS, metadata unik, dan teks HTML bermakna.
- [ ] Route legacy memberi `404` dan tidak muncul pada navigasi, sitemap, atau internal link.
- [ ] `/vote`, `/bukti/*`, `/live`, `/panitia/*`, `/auth/*`, dan `/api/*` memakai `noindex`/proteksi yang relevan serta tidak ada di sitemap.
- [ ] Sitemap hanya memuat canonical yang benar-benar ingin diindeks.
- [ ] Tidak ada NIM, receipt, pilihan pemilih, token, atau data audit pada HTML, metadata, Open Graph, schema, maupun URL publik.
