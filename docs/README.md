# Dokumentasi Voting Ketua Angkatan PGSD 2026

Dokumentasi ini adalah sumber acuan sebelum implementasi website voting. Ruang lingkupnya adalah pemilihan Ketua Angkatan PGSD 2026 dalam kegiatan PPPK.

## Urutan baca

0. [start-here.md](start-here.md) — jalur masuk untuk setiap pekerjaan.
1. [CATALOG.md](CATALOG.md) — peta seluruh domain dokumentasi.
2. [00-pedoman-eksekusi-berbasis-md.md](00-pedoman-eksekusi-berbasis-md.md) — aturan wajib kerja berbasis Markdown.
3. [01-scope-dan-keputusan.md](01-scope-dan-keputusan.md)
4. [02-alur-voting.md](02-alur-voting.md)
5. [03-data-dan-keamanan.md](03-data-dan-keamanan.md)
6. [04-ui-ux-dan-visual.md](04-ui-ux-dan-visual.md)
7. [05-rencana-implementasi.md](05-rencana-implementasi.md)
8. [06-arsitektur-teknis.md](06-arsitektur-teknis.md)
9. [07-kontrak-data.md](07-kontrak-data.md)
10. [08-kontrak-api-dan-realtime.md](08-kontrak-api-dan-realtime.md)
11. [09-sop-panitia.md](09-sop-panitia.md)
12. [10-quality-gate-dan-pengujian.md](10-quality-gate-dan-pengujian.md)
13. [11-setup-calon-individu.md](11-setup-calon-individu.md)
14. [12-rute-dan-seo.md](12-rute-dan-seo.md)
15. [13-reset-dan-pengulangan-event.md](13-reset-dan-pengulangan-event.md)
16. [14-inventaris-materi-calon.md](14-inventaris-materi-calon.md)
17. [15-runbook-eksekusi-proyek.md](15-runbook-eksekusi-proyek.md) — langkah eksekusi T0–T12 dan gate go/no-go.
18. [16-log-eksekusi.md](16-log-eksekusi.md) — register wajib sebelum dan sesudah setiap proses.
19. [17-decision-register.md](17-decision-register.md)
20. [18-rancangan-legalitas-dan-privasi.md](18-rancangan-legalitas-dan-privasi.md)
21. [19-operasional-aplikasi.md](19-operasional-aplikasi.md) — cara setup dan batas fitur yang benar-benar telah dibangun.
22. [20-integritas-perangkat-dan-anti-duplikasi.md](20-integritas-perangkat-dan-anti-duplikasi.md) — implementasi in-review dua claim browser tanpa OTP, Wi-Fi bersama, reset, dan privasi.
23. [21-redesign-civic-forest.md](21-redesign-civic-forest.md) — arah visual, batas GSAP/Motion, responsivitas, dan acceptance redesign UI/UX.
24. [engineering/README.md](engineering/README.md), [database/README.md](database/README.md), [ui/README.md](ui/README.md), [workflow/README.md](workflow/README.md), dan [phases/README.md](phases/README.md) — indeks domain granular.
25. [data/daftar-nim-master.md](data/daftar-nim-master.md) - internal admin, jangan dipublikasikan
26. [data/mapping-calon-nim-internal.md](data/mapping-calon-nim-internal.md) - internal admin/restricted, jangan dipublikasikan

## Status keputusan

| Area | Status | Catatan |
| --- | --- | --- |
| Pemilih master | Teridentifikasi | 437 NIM unik dari spreadsheet. |
| Daftar pemilih final | Menunggu panitia | Tentukan semua master atau hanya 425 peserta bertanda hadir. |
| Calon individu | Siap review panitia | Sembilan poster calon dan visi-misi tersedia pada folder sumber `paslon/`; mapping NIM sudah dibuat secara internal dan masih memerlukan review dua admin serta pengesahan posisi. |
| Jadwal voting | Menunggu panitia | Tanggal agenda proposal telah berlalu. |
| Device-binding tanpa OTP | Source in review | User menyetujui rancangan pada 2026-10-03; dua claim browser ter-HMAC, IP tetap shared-network friendly, dengan batas impersonasi yang jelas. Migration staging, UAT, dan notice privasi masih wajib. |
| Stack | Siap deploy | Next.js + TypeScript di Vercel dan PostgreSQL serverless yang dikonfigurasi melalui environment variable. |
| Redesign UI/UX Civic Forest | In progress | Motion tetap menjadi standar interaksi; GSAP terbatas untuk entrance hero beranda, tanpa scroll hijacking atau efek pada vote/admin/live. |
| Source aplikasi | Siap konfigurasi | Next.js, PostgreSQL serverless, import peserta, admin, voting, receipt, hasil agregat, serta reset suara → reset peserta tersedia. Setup dan batasnya ada pada `19-operasional-aplikasi.md`. |
| Ekspansi dokumentasi | Selesai | Struktur voting dipecah menjadi katalog, fase, engineering, database, UI, workflow, dan aset setara kedalaman `v12`; dokumen operasional aplikasi melengkapi status implementasi. |

## Sumber referensi

- `../Proposal PPPK 2026 FINAL.pdf`: menetapkan PPPK 2026, sasaran mahasiswa baru S1 PGSD FIP UNESA angkatan 2026, serta agenda pemilihan ketua angkatan pada PPPK Day 4.
- `../ABSENSI PPPK PGSD 2026.xlsx`: master awal peserta yang akan diimpor ke daftar pemilih.

## Batas dokumen

Dokumen ini adalah indeks rancangan dan implementasi. Aplikasi lokal telah tersedia, tetapi jadwal final, akun admin production, domain/hosting, dan kebijakan peserta tanpa tanda hadir tetap harus disahkan panitia sebelum event dibuka.

## Tata kelola dokumentasi

- Setiap proses proyek mengikuti `00-pedoman-eksekusi-berbasis-md.md`, urutan `15-runbook-eksekusi-proyek.md`, dan entry wajib di `16-log-eksekusi.md`. Tidak ada tindakan material tanpa dasar dan jejak Markdown.
- Dokumen ini adalah indeks dan register status; detail konseptual hanya ditulis pada file pemiliknya.
- Perubahan proses bisnis diperbarui berurutan pada `01`, `02`, `03`, `07`, `08`, `09`, dan `10` bila terdampak.
- Perubahan visual diperbarui di `04`; perubahan dependency atau fase delivery diperbarui di `05` dan `06`.
- Status keputusan hanya boleh berubah dari **Menunggu panitia** ke **Disetujui** apabila tercatat siapa yang menyetujui dan kapan keputusan berlaku.
- Ketika implementasi dimulai, setiap requirement memiliki ID yang dapat ditelusuri ke test acceptance pada `10-quality-gate-dan-pengujian.md`.

## Kamus singkat

| Istilah | Definisi operasional |
| --- | --- |
| Event | Satu periode pemilihan dengan calon individu, aturan, daftar pemilih, dan rekapnya sendiri. |
| Calon | Satu individu yang tampil sebagai satu pilihan pada surat suara. |
| Pemilih eligible | Peserta master yang memenuhi kebijakan hak pilih untuk event tersebut. |
| Suara sah | Satu record vote final yang lolos semua validasi server dan tidak dibatalkan melalui prosedur resmi. |
| Receipt | Kode acak yang membuktikan server menerima suara tanpa mengungkap calon atau NIM. |
| Hasil live | Agregat jumlah/persentase suara per calon yang dipublikasikan selama event terbuka. |
| Koreksi/void | Pembatalan suara melalui persetujuan dua pihak dan audit; bukan pengeditan pilihan. |

## Model akses aplikasi

Sistem memiliki tepat dua role aplikasi:

| Role | Auth | Hak akses |
| --- | --- | --- |
| `visitor` | Tidak perlu login | Melihat halaman publik/hasil live, melakukan verifikasi NIM, dan mengirim satu suara bila eligible. |
| `admin` | Wajib login dan MFA di production | Mengelola event/calon/import, melihat audit/rekap, mengelola ekspor, serta menjalankan tindakan administratif. |

Istilah fungsi seperti reviewer import, pengaju void, penyetuju void, atau penanggung jawab insiden bukan role aplikasi. Fungsi tersebut dapat dijalankan akun `admin` yang berbeda; tindakan sensitif memerlukan dua akun admin berbeda dan audit.

## Matriks ketertelusuran

| Kebutuhan | Dokumen pemilik | Bukti akhir |
| --- | --- | --- |
| Satu NIM hanya satu suara | `02`, `07`, `08` | Uji konkurensi `VOT-02`. |
| Hasil calon live | `02`, `08` | Event realtime dan fallback polling tervalidasi. |
| Perlindungan data pemilih | `03`, `07`, `08` | Audit redaksi PII `SEC-01`. |
| Tampilan hutan sinematik | `04`, `05` | Uji responsif, performance, reduced motion. |
| Operasional panitia | `09` | Simulasi/UAT dan arsip rekap. |
