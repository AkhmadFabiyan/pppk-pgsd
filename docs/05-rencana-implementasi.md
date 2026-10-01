# 05. Rencana Implementasi

## Stack yang disetujui

| Teknologi | Peran |
| --- | --- |
| Next.js + TypeScript | Framework utama dengan App Router untuk halaman publik, panel panitia, route handler, dan optimasi delivery. |
| Tailwind CSS | Sistem styling, token visual, responsivitas, dark/light utility bila diperlukan, serta konsistensi antarkomponen. |
| Motion (Framer Motion) | Micro-interaction, modal, feedback pilihan/submit, perubahan hasil nyata, dan transisi halaman singkat. |
| CSS transition | Default untuk hover/focus sederhana; menjaga bundle kecil dan perilaku UI mudah diaudit. |
| GSAP, Lenis, Three.js, React Three Fiber | Tidak dipasang pada rilis pertama. Efek sinematik, smooth-scroll, dan canvas tidak dibutuhkan untuk UX voting profesional. |
| shadcn/ui | Primitive komponen bila diperlukan: dialog, sheet, dropdown, toast, button, input, dan form pattern. Komponen ditheme melalui token desain proyek. |
| Lucide React | Ikon UI yang konsisten, aksesibel, dan mudah dikustomisasi. |
| PostgreSQL atau MySQL + ORM | Database transaksional dengan migrasi, constraint unik, dan transaksi vote. |
| Layanan auth + realtime + object storage | Login/MFA role `admin`, kanal hasil agregat live, dan penyimpanan foto calon tervalidasi. |

## Aturan penggunaan motion

- Gunakan Motion hanya untuk feedback yang bermakna; CSS transition adalah default untuk state sederhana.
- Tidak ada GSAP, Lenis, canvas, parallax, particle, atau 3D pada rilis pertama. Penambahan di masa depan memerlukan ADR, review aksesibilitas, dan bukti tidak menurunkan UX voting.
- Pada mobile, perangkat low-end, koneksi lambat, atau `prefers-reduced-motion`, semua motion non-fungsional harus hilang tanpa menyembunyikan state.
- Native scroll, `Tab`, anchor link, screen reader, serta input form tidak boleh diintervensi library animasi.
- Anggaran performa wajib diuji sebelum rilis: tidak ada animasi yang menurunkan respons form atau membuat perangkat panas saat voting.

Pemilihan layanan hosting, database, autentikasi, dan realtime belum dikunci karena berpengaruh pada biaya, data pribadi, dan akses admin. Jangan mengirim data pemilih ke layanan analitik pihak ketiga tanpa persetujuan dan pemberitahuan privasi.

## Tahap pengerjaan

| Tahap | Hasil | Gate sebelum lanjut |
| --- | --- | --- |
| 1. Konfirmasi operasional | Calon, daftar hak pilih, jadwal WIB, admin, kebijakan hasil, retensi data. | Keputusan pada `01-scope-dan-keputusan.md` terisi. |
| 2. Fondasi data dan admin | Skema, impor pratinjau, auth admin, audit log, konfigurasi event. | Uji constraint satu NIM satu suara dan admin-only policy lulus. |
| 3. Alur pemilih | Landing, NIM verification, calon, konfirmasi, receipt. | Uji mobile, aksesibilitas, dan kasus duplikasi lulus. |
| 4. Hasil realtime dan keamanan | Agregat live, rate limit, CAPTCHA adaptif, monitoring anomali. | Load test dan review privasi selesai. |
| 5. UAT dan peluncuran | Simulasi dengan data dummy, SOP panitia, backup, rollback. | Panitia menyetujui hasil simulasi. |

## Pengujian minimum

- Unit: normalisasi NIM, status event, validasi calon, receipt, dan deteksi duplicate vote.
- Integrasi: dua request simultan pada NIM sama menghasilkan tepat satu suara sah.
- E2E: pemilih valid, NIM tidak ada, NIM sudah memilih, voting belum/sudah ditutup, serta kegagalan jaringan setelah submit.
- Keamanan: authorization visitor/admin, rate limiting, CSRF, input/file upload validation, dan tidak ada PII pada respons publik.
- Visual: Chrome/Edge/Safari mobile serta desktop; 320 px, 375 px, 768 px, dan 1440 px; reduced motion dan keyboard navigation.

## Risiko utama dan mitigasi

| Risiko | Mitigasi |
| --- | --- |
| NIM dibagikan kepada orang lain | Prioritaskan SSO/OTP jika integritas pemilih harus kuat; jangan mengandalkan fingerprint/IP. |
| Lonjakan akses saat voting singkat | Uji beban, cache halaman publik, kuota realtime, dan siapkan halaman status. |
| Hasil live memengaruhi pilihan | Panitia telah memilih publikasi jumlah per calon; tampilkan timestamp/revision yang jujur, tetapkan aturan komunikasi, dan catat keputusan ini pada sign-off event. |
| Kebocoran daftar peserta | Admin-only policy, enkripsi, ekspor terbatas, retensi jelas, dan audit akses. |
| Admin keliru mengatur periode/calon | Draft/preview, review dua akun admin, dan kunci konfigurasi saat voting dibuka. |

## Deliverable per tahap

| Tahap | Artefak kode | Artefak operasional | Owner review |
| --- | --- | --- | --- |
| 1 | Environment matrix, ADR keputusan layanan | Sign-off calon/hak pilih/jadwal/retensi | Admin yang ditunjuk panitia. |
| 2 | Schema/migration, seed dummy, auth admin, import preview | Template master data dan hasil review import | Dua akun admin. |
| 3 | Public routes, vote service, receipt, responsive UI | Skrip simulasi pemilih dan materi bantuan | QA + perwakilan panitia. |
| 4 | Realtime, cache, observability, abuse protection | Dashboard monitoring dan playbook incident | Admin + teknis. |
| 5 | Build production, backup/restore, release config | UAT, SOP final, contact tree, arsip hasil | Admin + pemilik data. |

## Kebijakan dependency dan kualitas kode

- Pin versi dependency melalui lockfile; update hanya melalui pull request/review dengan hasil test yang direkam.
- shadcn/ui adalah source component yang diaudit dalam repository; primitive diubah hanya melalui token desain, bukan salinan markup yang berbeda-beda.
- Motion, GSAP, Lenis, Three.js/R3F dimuat modular. Code 3D/GSAP tidak boleh masuk initial bundle bilik suara.
- Semua input menggunakan schema validation bersama antara client/server; client validation hanya meningkatkan UX, bukan otorisasi.
- Jangan menulis query database pada komponen React atau menaruh business rule voting pada animation callback.
- Lint, typecheck, unit/integration/E2E, scan dependency, dan build production harus menjadi CI requirement.

## Rencana lingkungan dan rilis

| Environment | Data | Akses | Tujuan |
| --- | --- | --- | --- |
| Local | Dummy/anonim | Developer | Iterasi UI dan unit test. |
| Staging | Data test yang tidak mengandung PII production | Tim terbatas | UAT, load test, migration/rollback rehearsal. |
| Production | Data final terenkripsi | Panitia terotorisasi | Event aktual dan pengarsipan. |

Release production memakai migration yang dapat ditinjau, health check, smoke test, rollback plan, dan mode maintenance yang menolak vote bila integritas tidak dapat dijamin. Tidak ada deploy visual besar selama voting terbuka kecuali respons incident yang disetujui admin yang ditunjuk.

## Estimasi kerja berbasis dependensi

Urutan wajib adalah keputusan operasional → data/auth → integritas vote → UI voting → realtime/monitoring → UAT/release. Animasi sinematik dapat berjalan paralel dengan UI landing, tetapi tidak boleh menunda test integritas atau mengubah kontrak voting. Tanggal estimasi tidak ditentukan sebelum jumlah calon, jadwal, layanan hosting, dan faktor verifikasi final disetujui.
