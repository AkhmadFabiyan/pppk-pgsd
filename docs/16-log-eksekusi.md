# 16. Log Eksekusi Proyek

File ini adalah register kerja aktif. Setiap proses material wajib memiliki entry di sini **sebelum** aksi dilakukan, sesuai `00-pedoman-eksekusi-berbasis-md.md`. Jangan menghapus riwayat; perbaiki dengan amendment atau entry baru.

> **Larangan data:** jangan masukkan NIM, nama pemilih, IP, token, password, pilihan vote personal, receipt lengkap, atau detail restricted lain. Referensikan ID audit/berkas secure yang telah disensor.

## Cara membuat entry

1. Tambahkan ID `EXE-YYYYMMDD-NN` pada register dan gunakan ID yang sama pada commit, tiket, bukti, atau catatan review bila tersedia.
2. Isi scope, tahap runbook, dokumen wajib, owner, reviewer, dan entry condition sebelum status menjadi `In progress`.
3. Saat bekerja, catat perubahan keputusan, risiko, blocker, dan file yang berubah.
4. Sebelum status `Done`, masukkan bukti test/review dan keputusan gate. Gunakan `Blocked` bila tidak dapat menyelesaikan prasyarat.

## Register status

| ID | Tahap | Judul | Status | Owner | Reviewer | Mulai | Gate/keputusan berikutnya |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EXE-20261001-01 | T0 | Aktifkan kendali dokumen berbasis Markdown | Done | Pelaksana dokumentasi | Admin panitia (menunggu penunjukan) | 2026-10-01 | T1 dapat dimulai setelah panitia menunjuk owner/reviewer dan menyetujui keputusan awal. |
| EXE-20261001-02 | T1 | Konfirmasi keputusan operasional event | Planned | Admin penanggung jawab (belum ditunjuk) | Admin kedua (belum ditunjuk) | — | Blocked sampai panitia menetapkan posisi, eligible, jadwal, dan kebijakan hasil. |
| EXE-20261001-03 | T3 | Review mapping dan materi sembilan calon | Planned | Admin operasional (belum ditunjuk) | Admin kedua (belum ditunjuk) | — | Blocked sampai panitia mengesahkan posisi/event dan menunjuk dua admin. |
| EXE-20261001-04 | Prototipe T5/T9 | Bangun prototipe lokal antarmuka voting | Cancelled | Pelaksana teknis | Panitia (review visual) | 2026-10-01 | Source dan preview lokal telah dihapus atas permintaan user; T1–T4 tetap wajib sebelum implementasi production. |
| EXE-20261001-05 | Prototipe T9 | Rancang ulang visual editorial civic forest | Cancelled | Pelaksana teknis | Panitia (review visual) | 2026-10-01 | Implementasi prototype dihapus; desain v2 tersisa sebagai referensi dokumentasi dan tidak mengubah production gate. |
| EXE-20261001-06 | T0 / Dokumentasi | Ekspansi struktur docs setara v12 | Done | Pelaksana dokumentasi | Panitia (review struktur) | 2026-10-01 | 122 file Markdown tersedia; katalog, indeks domain, fase, dan validasi tautan selesai tanpa PII publik. |
| EXE-20261001-07 | T9 / Dokumentasi | Tetapkan UI/UX production-ready | Done | Pelaksana dokumentasi | Panitia (review visual) | 2026-10-01 | Build berikutnya wajib memakai kontrak UI produk: data aktual, tanpa demo, responsif, dan motion fungsional. |
| EXE-20261001-08 | T5/T9 | Bangun ulang aplikasi publik production-ready | Done | Pelaksana teknis | Panitia (review visual dan konfigurasi) | 2026-10-01 | Aplikasi publik dibangun dan diverifikasi; event tetap `Terjadwal` sampai T1–T4 disahkan. |
| EXE-20261001-09 | T9 | Sederhanakan arsitektur informasi visitor | Done | Pelaksana teknis | Panitia (review UX) | 2026-10-01 | Visitor memakai satu beranda; route informasi lama redirect ke section terkait. |
| EXE-20261001-10 | T7/T9 | Sederhanakan workflow voting | Done | Pelaksana teknis | Panitia (review UX dan integritas) | 2026-10-01 | Satu route voting memakai tiga tahap linear dan tetap fail-closed hingga backend disahkan. |
| EXE-20261001-11 | T5/T9 | Hapus route legacy tidak terpakai | Done | Pelaksana teknis | Panitia (review UX) | 2026-10-01 | Route inti saja yang tersisa; URL legacy memberi 404. |
| EXE-20261001-12 | T5–T10 | Lengkapi aplikasi voting operasional | Done | Pelaksana teknis | Admin panitia (setup/review) | 2026-10-01 | Setup local tersedia; panitia wajib menjalankan UAT dan konfigurasi production sebelum membuka event. |
| EXE-20261002-13 | T9 | Perkaya interaksi editorial landing page | Done | Pelaksana teknis | Panitia (review visual) | 2026-10-02 | Landing publik interaktif selesai; voting tetap dipisahkan dari scene dekoratif. |
| EXE-20261002-14 | T5/T9 | Siapkan deployment Vercel dan sederhanakan pengalaman publik | In review | Pelaksana teknis | Panitia (review UX dan deployment) | 2026-10-02 | Panitia memasang database/secret Vercel, menjalankan UAT Preview tanpa PII production, lalu menyetujui release. |
| EXE-20261002-15 | T9 | Rancang layar hasil live satu viewport | Done | Pelaksana teknis | Panitia (review UX dan kebijakan hasil) | 2026-10-02 | Menunggu persetujuan untuk mengimplementasikan route `/live` pada build berikutnya. |
| EXE-20261002-16 | T5/T9 | Implementasi layar hasil live satu viewport | In review | Pelaksana teknis | Panitia (review UX dan kebijakan hasil) | 2026-10-02 | Panitia meninjau `/live` dengan database Preview dan menyetujui layar operasional sebelum memakainya pada event. |
| EXE-20261002-17 | T5/T7 | Sederhanakan inisialisasi akun admin | In review | Pelaksana teknis | Panitia (keamanan dan setup) | 2026-10-02 | Pasang environment Preview, uji login awal dengan secret baru, lalu setujui konfigurasi Production. |
| EXE-20261002-18 | T9 | Rancang ulang motion beranda publik | In review | Pelaksana teknis | Panitia (review visual dan aksesibilitas) | 2026-10-02 | Review landing pada Preview dengan database aman dan cek mobile/reduced-motion sebelum menyetujui rilis. |
| EXE-20261002-19 | T5/T7 | Rancang reset peserta dan data simulasi | In review | Pelaksana teknis | Panitia (operasional dan integritas) | 2026-10-02 | Jalankan UAT admin untuk urutan reset suara → reset peserta pada database yang dipilih panitia. |
| EXE-20261002-20 | T9 | Tambahkan signature branding konsol | In review | Pelaksana teknis | User | 2026-10-02 | Tinjau pesan konsol sekali per sesi pada browser biasa dan pastikan tanpa PII, request, atau gangguan UI. |

## Detail entry aktif

### EXE-20261001-01 — Aktifkan kendali dokumen berbasis Markdown

| Field | Catatan |
| --- | --- |
| Status | `Done` — artefak dokumentasi dibuat; belum merupakan persetujuan panitia atau implementasi aplikasi. |
| Scope | Membuat pedoman, runbook, dan log; menghubungkannya ke indeks dokumentasi. |
| Out of scope | Mengubah spreadsheet, mengimpor data production, menetapkan calon published, membuat aplikasi, atau mengubah konfigurasi event. |
| Dokumen dasar | `README.md`, `00-pedoman-eksekusi-berbasis-md.md`, `15-runbook-eksekusi-proyek.md`. |
| Dokumen diperbarui | `README.md`, `00-pedoman-eksekusi-berbasis-md.md`, `15-runbook-eksekusi-proyek.md`, `16-log-eksekusi.md`. |
| Bukti | Pemeriksaan tautan Markdown dan pemeriksaan kebocoran NIM pada dokumen non-internal dijalankan setelah perubahan. |
| Reviewer | Belum ada; panitia perlu menunjuk admin penanggung jawab dan admin kedua. |
| Keputusan lanjut | Mulai `EXE-20261001-02`, bukan coding atau import. |

### EXE-20261001-04 — Bangun prototipe lokal antarmuka voting

| Field | Catatan |
| --- | --- |
| Status | `Cancelled` — source, dependency, build, dan preview lokal dihapus atas permintaan user; catatan ini dipertahankan sebagai riwayat keputusan. |
| Tahap runbook | Jalur prototipe lokal T5/T9; bukan penyelesaian T5/T9 production. |
| Tujuan | Menyediakan preview responsif bertema hutan untuk meninjau kandidat, alur pilihan, hasil simulasi, animasi, dan aksesibilitas dasar. |
| Scope | Bootstrap Next.js lokal, layout/rute publik, fixture calon dari materi publik, state demo di browser, halaman kandidat, vote demo, dan hasil simulasi. |
| Out of scope | NIM, spreadsheet, database, autentikasi/admin, pemungutan suara sungguhan, realtime provider, analytics, export, deployment, dan keputusan event production. |
| Dokumen wajib dibaca | `00`, `04`, `05`, `06`, `10`, `11`, `12`, `15`, `16`. |
| Dokumen yang terdampak | `00`, `04`, `05`, `10`, `12`, `15`, `16`, `README` bila status build berubah. |
| Entry condition | T0 selesai; user mengarahkan untuk mulai build; seluruh data yang dipakai bersifat publik/dummy. |
| Owner | Pelaksana teknis. |
| Reviewer/approver | Panitia untuk review visual; tidak ada approval production pada entry ini. |
| Risiko dan mitigasi | Prototype dapat disalahpahami sebagai voting resmi; semua state dan UI hasil diberi label demo serta tidak memiliki input NIM/persistence. |
| Aksi yang dilakukan | Membuat fondasi Next.js + TypeScript, Tailwind, Motion, GSAP, Lenis, dan Lucide; rute `/`, `/kandidat`, `/kandidat/[slug]`, `/panduan-voting`, `/vote`, `/bukti/[receiptCode]`, `robots.txt`, serta `sitemap.xml`; state hasil/vote hanya berada pada memori browser. Sembilan poster dipakai sebagai aset preview lokal tanpa master NIM. |
| Bukti | `npm run lint`, `npm run typecheck`, dan `npm run build` lulus. Delapan rute HTTP merespons `200`; build tidak memuat dokumen restricted atau pola NIM 11 digit; `robots.txt` menolak `/vote`; sitemap tidak memuat `/vote` dan memuat 9 detail calon. Preview berjalan pada `http://localhost:3001`. |
| Catatan QA visual | Kontrol browser otomatis tidak dapat diinisialisasi di lingkungan kerja ini. Review visual dilakukan melalui URL preview oleh panitia; pemeriksaan rute/HTML dan build tetap lulus. |
| Exit condition | Panitia meninjau preview; feedback visual dicatat sebagai entry/amendment berikutnya. Entry dapat `Done` bila prototype disetujui atau catatan review terselesaikan. |
| Keputusan | Prototype siap direview, tetapi tidak boleh dianggap voting resmi. T1–T4 tetap `Planned`/`Blocked` untuk data dan production. |
| Waktu | Mulai 2026-10-01 WIB; pemeriksaan teknis selesai 2026-10-01 WIB. |

### EXE-20261001-05 — Rancang ulang visual editorial civic forest

| Field | Catatan |
| --- | --- |
| Status | `Cancelled` — implementasi prototype dihapus; rancangan visual v2 hanya tersisa sebagai referensi dokumentasi. |
| Tahap runbook | Jalur prototipe lokal T9. |
| Tujuan | Mengganti visual yang terasa generik menjadi antarmuka pemilihan editorial: informasi event lebih dominan, hutan lebih subtil, warna hijau–merah lebih terarah, dan motion lebih hemat. |
| Scope | Hierarki header/hero, sistem warna/tipografi, daftar kandidat, rekap hasil, bilik suara, receipt, dan copy publik prototype. |
| Out of scope | NIM, database, admin, jadwal resmi, data suara nyata, API, serta keputusan production. |
| Dokumen wajib dibaca | `00`, `04`, `05`, `10`, `12`, `15`, `16`. |
| Dokumen yang terdampak | `04`, `16`, dan file UI prototype; `README` bila status berubah. |
| Entry condition | User meminta rancang ulang; prototype lokal telah dapat dibuild dan seluruh data tetap publik/dummy. |
| Owner | Pelaksana teknis. |
| Reviewer/approver | Panitia untuk review visual. |
| Risiko dan mitigasi | Menghapus label demo dapat menyesatkan; status preview dipertahankan satu kali pada header/status, sementara tindakan tidak memproses data sungguhan. |
| Bukti | Lint, typecheck, build, route check, dan preview lokal setelah redesign. |
| Exit condition | Rancangan baru dapat direview pada browser dan tidak menambah persistence/PII. |
| Keputusan | Lanjut sebagai redesign prototype; gate T1–T4 production tidak berubah. |
| Waktu | Mulai 2026-10-01 WIB. |

#### Amendment A1

| Field | Isi |
| --- | --- |
| Tanggal/WIB | 2026-10-01 WIB |
| Alasan perubahan | User meminta seluruh source aplikasi dihapus, kecuali docs, spreadsheet, PDF, dan folder poster calon. |
| Dampak | Prototipe Next.js, dependency, konfigurasi, build, dan preview lokal dihapus; tidak ada aplikasi yang dapat direview lagi. |
| Persetujuan | User. |
| Keputusan | `Cancelled`; desain v2 tetap menjadi referensi dokumentasi, bukan implementasi aktif. |

### EXE-20261001-06 — Ekspansi struktur dokumentasi setara v12

| Field | Catatan |
| --- | --- |
| Status | `Done`. |
| Tahap runbook | T0 / tata kelola dokumentasi. |
| Tujuan | Menyediakan struktur dokumentasi granular agar setiap area voting memiliki pemilik, kontrak, fase, dan bukti sendiri seperti standar v12. |
| Scope | Katalog, glossary, development rules, decision register, asset register, engineering, database, UI, workflow, dan phase execution. |
| Out of scope | Menghidupkan kembali source aplikasi, mengimpor spreadsheet, mempublikasikan data restricted, atau mengubah keputusan panitia. |
| Dokumen wajib dibaca | `00`, `01`–`16`, serta inventaris struktur `v12` sebagai referensi pola. |
| Dokumen yang terdampak | `README`, `16`, dokumen baru pada folder domain dokumentasi. |
| Entry condition | User mengarahkan “proses”; dokumentasi dan materi referensi masih tersedia. |
| Owner | Pelaksana dokumentasi. |
| Reviewer/approver | Panitia untuk menilai kelengkapan struktur. |
| Risiko dan mitigasi | Dokumentasi menjadi terlalu panjang atau duplikatif; setiap file baru diberi pemilik/topik, batas scope, dan link ke sumber utama. |
| Aksi yang dilakukan | Menambah `CATALOG`, start-here, overview, glossary, development rules, design system, decision register, legal/privacy, asset register, 12 dokumen engineering, 12 dokumen database, 11 dokumen UI tambahan, 12 workflow tambahan, dan 36 fase delivery. |
| Bukti | Inventaris akhir: 122 file Markdown, setara jumlah referensi v12. Pemeriksaan: 30 tautan Markdown internal valid, 0 tautan hilang, 0 pola NIM 11 digit pada dokumen di luar `docs/data/`. |
| Exit condition | Struktur setara v12 tersedia, terindeks, tidak memiliki tautan rusak, dan tetap tidak membocorkan NIM. |
| Keputusan | Selesai; build berikutnya wajib memakai `start-here.md`, `CATALOG.md`, dan fase terkait. |
| Waktu | Mulai dan selesai 2026-10-01 WIB. |

### EXE-20261001-07 — Tetapkan UI/UX production-ready

| Field | Catatan |
| --- | --- |
| Status | `Done`. |
| Tahap runbook | T9 / desain dan aksesibilitas. |
| Tujuan | Mengganti arah UI generik/prototipe dengan spesifikasi aplikasi voting siap pakai yang sederhana, profesional, responsif, dan beranimasi secara fungsional. |
| Scope | Kontrak anti-demo, arah visual hutan institusional, token, layout, rute, bilik suara, hasil, admin, breakpoint, motion, dan acceptance visual. |
| Out of scope | Membuat ulang source aplikasi, mengubah data kandidat, mengimpor NIM, atau membuka event voting. |
| Dokumen wajib dibaca | `04-ui-ux-dan-visual.md`, `14-design-system.md`, `05-rencana-implementasi.md`, `ui/README.md`, dan `phases/phase-25.md`. |
| Dokumen yang terdampak | `04-ui-ux-dan-visual.md`, `14-design-system.md`, `05-rencana-implementasi.md`, `12-rute-dan-seo.md`, `ui/README.md`, `phases/phase-25.md`, dan `16-log-eksekusi.md`. |
| Risiko dan mitigasi | Tema hutan dapat kembali menjadi dekorasi berlebihan; kontrak melarang canvas/3D/parallax/particle pada rilis pertama dan mewajibkan data aktual serta status jujur. |
| Aksi yang dilakukan | Menulis ulang spesifikasi visual sebagai produk siap pakai, menormalkan desain sistem, menghapus dependensi visual berat dari rencana rilis awal, dan menetapkan acceptance responsif/motion. |
| Bukti | Review statis dokumen: tidak ada fallback data fiktif pada kontrak production; rute, state event, breakpoint 320 px–desktop, serta six motion contracts didefinisikan. |
| Exit condition | Build baru mengimplementasikan seluruh acceptance UI dan lulus review visual panitia sebelum event dibuka. |
| Keputusan | Tidak ada UI demo/preview di production; setiap state publik bersumber dari event server dan data published. |
| Waktu | Mulai dan selesai 2026-10-01 WIB. |

### EXE-20261001-08 — Bangun ulang aplikasi publik production-ready

| Field | Catatan |
| --- | --- |
| Status | `Done`. |
| Tahap runbook | T5/T9; fondasi aplikasi publik dan implementasi visual. |
| Tujuan | Membangun ulang website Next.js dari nol dengan UI production-ready, konten calon yang tersedia, serta state event jujur tanpa data suara fiktif. |
| Scope | Next.js/TypeScript, routing publik, kandidat, detail visi-misi, panduan, hasil dengan state kebijakan, receipt defensif, SEO dasar, desain responsif, dan Motion fungsional. |
| Out of scope | Import spreadsheet/NIM, database production, autentikasi admin, pembukaan voting, penerimaan suara, hasil live, reset event, dan deployment domain. |
| Dokumen wajib dibaca | `01`, `04`, `05`, `06`, `08`, `11-setup-calon-individu`, `12-rute-dan-seo`, `14`, `15`, `phases/phase-06`, `phase-16`, `phase-20`, `phase-25`, `phase-26`. |
| Entry condition | User mengarahkan untuk melanjutkan; source lama sudah tidak ada; aplikasi awal harus aman saat keputusan T1–T4 belum disahkan. |
| Risiko dan mitigasi | Tampilan dapat disalahartikan siap menerima vote; konfigurasi awal event dipasang sebagai `scheduled` dan rute vote hanya memberi status jujur sampai backend/keputusan tersedia. |
| Aksi yang dilakukan | Menambahkan Next.js 16 + TypeScript + Tailwind + Motion + Lucide, routing publik, metadata/robots/sitemap, poster calon dalam aset publik, layout responsive, dan state event `scheduled` yang fail-closed. |
| Bukti | `npm run typecheck`, `npm run lint`, dan `npm run build` lulus. Dua belas rute (`/`, kandidat, detail calon, panduan, vote, hasil, receipt, tentang, bantuan, privasi, robots, sitemap) memberi HTTP `200`; tidak ada label `demo` atau `preview` dalam respons yang diperiksa. |
| Exit condition | Build publik lulus pemeriksaan teknis, responsif secara struktur, tidak menyajikan data suara buatan, dan dokumentasi status diperbarui. |
| Keputusan | Fondasi public UI siap ditinjau di localhost. Implementasi voting transaksional, NIM, admin, import, realtime, reset, dan deployment tetap menunggu gate T1–T4. |
| Waktu | Mulai dan selesai 2026-10-01 WIB. |

#### Amendment A1 — Proporsi poster asli

| Field | Catatan |
| --- | --- |
| Alasan perubahan | User meminta poster tidak diubah atau di-crop. |
| Perubahan | Kartu dan detail calon menggunakan dimensi sumber `4000 × 2250` (16:9), tinggi otomatis, tanpa `object-fit: cover` atau hover zoom. |
| Bukti | SHA-256 sembilan file `public/paslon/` identik dengan sembilan file sumber pada `paslon/`; `npm run typecheck` dan `npm run build` lulus setelah perubahan. |
| Dampak | Poster mempertahankan seluruh komposisi asli pada semua breakpoint; layout kartu beradaptasi pada rasio 16:9. |

### EXE-20261001-09 — Sederhanakan arsitektur informasi visitor

| Field | Catatan |
| --- | --- |
| Status | `Done`. |
| Tahap runbook | T9 / desain informasi dan aksesibilitas. |
| Tujuan | Mengurangi banyaknya halaman visitor tanpa menghilangkan informasi penting atau mengubah batas data voting. |
| Scope | Beranda one-page, navigasi anchor, detail visi-misi inline, hasil/panduan/bantuan/privasi ringkas pada beranda, redirect URL lama, dan penyesuaian SEO/rute. |
| Out of scope | Mengubah mekanisme vote, NIM, data calon, admin, atau kebijakan hasil. |
| Dokumen wajib dibaca | `04-ui-ux-dan-visual.md`, `12-rute-dan-seo.md`, `14-design-system.md`, `ui/*.md`, dan `phases/phase-20.md`. |
| Risiko dan mitigasi | Beranda bisa menjadi terlalu panjang; navigasi anchor, heading semantik, section ringkas, dan drawer detail calon inline digunakan agar tetap mudah dipindai. |
| Aksi yang dilakukan | Menggabungkan konten visitor ke `/`, mengganti navigasi menjadi anchor, membuat detail visi-misi calon inline, memindahkan hasil/panduan/bantuan/privasi ke section beranda, menghapus page visitor terpisah, dan membuat redirect permanen untuk URL lama. |
| Bukti | `npm run build`, `npm run typecheck`, dan `npm run lint` lulus. Build memuat hanya `/`, `/vote`, `/bukti/[receiptCode]`, `/panitia/login`, `robots.txt`, dan `sitemap.xml`. Tujuh URL lama diperiksa dan masing-masing memberi `308` ke anchor tepat; semua route aktif memberi HTTP `200`. |
| Exit condition | Visitor hanya membutuhkan `/`; `/vote` dan receipt tetap terpisah karena transaksi, sementara admin tetap terlindungi. |
| Keputusan | Selesai. Beranda menjadi source of truth pengalaman visitor; route lama dipertahankan sebagai redirect kompatibilitas. |
| Waktu | Mulai dan selesai 2026-10-01 WIB. |

### EXE-20261001-10 — Sederhanakan workflow voting

| Field | Catatan |
| --- | --- |
| Status | `Done`. |
| Tahap runbook | T7/T9 / integritas dan UX bilik suara. |
| Tujuan | Membuat alur pemilih sesingkat mungkin tanpa melemahkan transaksi server atau pencegahan suara ganda. |
| Scope | Satu route `/vote`, tiga tahap pemilih, copy/status terjadwal, kontrak UI, dan panduan operasional. |
| Out of scope | Mengaktifkan NIM, membuat sesi voting palsu, menerima vote tanpa database, atau mengubah anti-duplikasi server. |
| Dokumen wajib dibaca | `02-alur-voting.md`, `03-data-dan-keamanan.md`, `04-ui-ux-dan-visual.md`, `08-kontrak-api-dan-realtime.md`, `ui/vote.md`, dan `engineering/02-vote-integrity.md`. |
| Risiko dan mitigasi | Penyederhanaan dapat menghilangkan konfirmasi; tiga tahap tetap memisahkan verifikasi, pemilihan, dan konfirmasi final, sedangkan receipt diterbitkan otomatis setelah server menerima suara. |
| Aksi yang dilakukan | Menetapkan alur tiga tahap di dokumen, memperbarui kontrak bilik suara, dan membangun ulang `/vote` sebagai tampilan satu-route berisi tiga tahap serta status event. |
| Bukti | `npm run build`, `npm run typecheck`, dan `npm run lint` lulus. `GET /vote` memberi `200`, memuat ketiga tahap, memuat status `Terjadwal`, tidak memiliki input NIM, dan tidak memuat label demo/preview. |
| Exit condition | Alur tiga tahap terdokumentasi, tampil pada `/vote`, dan tidak dapat disalahartikan sebagai voting aktif. |
| Keputusan | Selesai. Backend yang akan mengaktifkan tahap pertama tetap menunggu gate T1–T4. |
| Waktu | Mulai dan selesai 2026-10-01 WIB. |

### EXE-20261001-11 — Hapus route legacy tidak terpakai

| Field | Catatan |
| --- | --- |
| Status | `Done`. |
| Tahap runbook | T5/T9 / penyederhanaan aplikasi. |
| Tujuan | Menghapus URL legacy yang tidak lagi dipakai setelah arsitektur satu beranda diterapkan. |
| Scope | Hapus redirect route informasi lama dan perbarui kontrak rute/SEO. |
| Out of scope | Menghapus `/`, `/vote`, receipt, admin, robots, sitemap, atau kontrak voting. |
| Risiko dan mitigasi | Tautan lama menjadi 404; keputusan user secara eksplisit meminta menghapus route tidak terpakai, dan navigasi aktif hanya mengarah ke route inti/anchor beranda. |
| Aksi yang dilakukan | Menghapus konfigurasi redirect legacy dan memperbarui kontrak UI/SEO agar semua informasi visitor hanya berada pada anchor beranda. |
| Bukti | `npm run build`, `npm run typecheck`, dan `npm run lint` lulus. Enam route inti memberi HTTP `200`; tujuh URL legacy diperiksa dan seluruhnya memberi `404`. |
| Exit condition | Hanya route inti tersisa; dokumentasi tidak lagi mengklaim redirect legacy tersedia. |
| Keputusan | Selesai; gunakan `/` dan anchor section untuk informasi visitor. |
| Waktu | Mulai dan selesai 2026-10-01 WIB. |

### EXE-20261001-12 — Lengkapi aplikasi voting operasional

| Field | Catatan |
| --- | --- |
| Status | `Done` — fungsi operasional baseline selesai dan diverifikasi secara teknis pada runtime local. |
| Tahap runbook | T5–T10 / implementasi fondasi, integritas vote, admin, dan UAT lokal. |
| Tujuan | Mengganti UI statis dengan aplikasi yang memiliki state server persisten dan fungsi operasional utama. |
| Scope | SQLite lokal, migrasi/seed calon, bootstrap dan login admin, session, import XLSX, eligible voters, publish calon, on/off hasil, verifikasi NIM, sesi singkat, transaksi one-vote, receipt, hasil agregat polling, audit, dan reset sebelum vote. |
| Out of scope | MFA/SSO provider kampus, hosting production, domain, enkripsi at-rest provider, CAPTCHA pihak ketiga, serta reset/penghapusan vote yang sudah sah. |
| Dokumen wajib dibaca | `01`, `02`, `03`, `06`, `07`, `08`, `09`, `10`, `11-setup-calon-individu`, `13-reset-dan-pengulangan-event`, `engineering/01-security`, `engineering/02-vote-integrity`, dan `workflow/*`. |
| Entry condition | User meminta seluruh kode operasional dilengkapi; source publik telah tersedia dan tidak memuat NIM. |
| Risiko dan mitigasi | Tanpa secret/bootstrap admin aplikasi tidak boleh dibuka untuk voting; kontrol open divalidasi server, default `scheduled`, dan reset ditolak bila ada vote sah. |
| Dokumen yang terdampak | `README.md`, `02-alur-voting.md`, `12-rute-dan-seo.md`, `ui/admin-*.md`, `19-operasional-aplikasi.md`, serta file source aplikasi. |
| Aksi yang dilakukan | Menambahkan SQLite bermigrasi dan seed katalog calon; autentikasi bootstrap/login admin; import XLSX; daftar pemilih internal; publikasi/sinkron katalog calon; kontrol open/close dan visibility hasil; API verifikasi NIM, sesi 10 menit, rate limit, transaksi one-vote/idempotency, receipt, rekap agregat, audit, dan reset pra-voting. Menambahkan `npm run setup:local` yang membuat secret local tanpa menimpa konfigurasi yang ada. |
| Bukti | `npm run typecheck`, `npm run lint`, dan `npm run build` lulus. Smoke test HTTP pada database sementara: `/` dan `/vote` memberi `200`; hasil tersembunyi memberi `404`; satu NIM test dapat diverifikasi dan mengirim satu suara; percobaan ulang NIM serta NIM tidak valid ditolak `403`; hasil live memberi `200` dan satu suara agregat; receipt memberi `200` tanpa identifier calon. Database test beserta file WAL/SHM dihapus setelah test. |
| Exit condition | Alur operasional dapat disiapkan oleh admin pada local runtime; kondisi production yang membutuhkan provider tetap tercatat jelas. |
| Keputusan | `Done` untuk baseline aplikasi. Panitia belum boleh membuka event production sebelum menjalankan setup, import, UAT, backup/HTTPS, dan keputusan eligibilitas/jadwal. |
| Waktu | Mulai dan selesai 2026-10-01 WIB. |

### EXE-20261002-13 — Perkaya interaksi editorial landing page

| Field | Catatan |
| --- | --- |
| Status | `Done`. |
| Tahap runbook | T9 / visual, motion, dan aksesibilitas. |
| Tujuan | Membuat halaman publik terasa lebih sinematik dan responsif terhadap scroll/pointer, dengan referensi ritme interaktif dari URL yang diberikan user tanpa menyalin aset, konten, atau source referensi. |
| Scope | Hero berbasis scene, scroll progress, layer hutan CSS, reveal section/card, pointer spotlight/tilt kandidat, ticker informatif, dan transisi visual antar-section. |
| Out of scope | Mengubah proses vote, NIM, database, admin, receipt, hasil, poster sumber, serta mengirim data pointer ke server. |
| Dokumen wajib dibaca | `04-ui-ux-dan-visual.md`, `14-design-system.md`, `ui/landing-page.md`, `ui/vote.md`, `engineering/11-accessibility-motion.md`, dan `19-operasional-aplikasi.md`. |
| Risiko dan mitigasi | Motion berlebihan dapat mengganggu performa atau bilik suara; semua efek dibatasi pada halaman publik, berbasis transform/opacity, tidak menggeser layout, dipadamkan oleh `prefers-reduced-motion`, dan tidak memakai data pengunjung. |
| Aksi yang dilakukan | Mengganti hero statis dengan scene hutan berlapis: scroll progress, horizon parallax transform, cahaya pointer desktop, daun/ticker dekoratif, entrance title, CTA shimmer, dan panel status yang responsif. Menambahkan reveal section, hover depth, pointer spotlight/tilt pada kartu kandidat, serta respons hover pada informasi publik. |
| Bukti | `npm run typecheck`, `npm run lint`, dan `npm run build` lulus. Smoke test HTTP: `/` memberi `200` dan memuat `forest-hero` serta `scroll-progress`; `/vote` memberi `200` dan tidak memuat scene dekoratif landing page. Review visual browser tetap diperlukan dari panitia pada perangkat target. |
| Exit condition | Halaman publik lebih interaktif namun tetap cepat, terbaca, responsif, serta halaman voting tetap tenang dan fungsional. |
| Keputusan | `Done`; tidak ada perubahan workflow vote, API, database, poster, atau data pemilih. |
| Waktu | Mulai dan selesai 2026-10-02 WIB. |

### EXE-20261002-14 — Siapkan deployment Vercel dan sederhanakan pengalaman publik

| Field | Catatan |
| --- | --- |
| Status | `In review` — implementasi repository dan quality gate lokal selesai; konfigurasi database/secret serta UAT Preview tetap harus dilakukan panitia. |
| Tahap runbook | T5/T7/T9 / deployment, integrity, dan UX. |
| Tujuan | Menghapus ketergantungan pada disk SQLite lokal agar aplikasi dapat di-host di Vercel serta mengganti pengalaman publik yang terlalu dekoratif menjadi lebih sederhana, fun, dan terarah. |
| Scope | Driver PostgreSQL serverless, migrasi schema/constraint, konfigurasi environment Vercel, penyederhanaan route/komponen tak terpakai, dan UI landing interaktif berbasis React Motion. |
| Out of scope | Membuat atau mengakses database cloud panitia, mengimpor spreadsheet production, membuka event, mengubah vote sah, atau mendaftarkan domain. |
| Dokumen wajib dibaca | `03-data-dan-keamanan.md`, `06-arsitektur-teknis.md`, `07-kontrak-data.md`, `08-kontrak-api-dan-realtime.md`, `10-quality-gate-dan-pengujian.md`, `12-rute-dan-seo.md`, `19-operasional-aplikasi.md`, dan `engineering/10-deployment.md`. |
| Risiko dan mitigasi | Vercel tidak menyediakan disk database persisten; gunakan PostgreSQL serverless dengan URL environment. Build tetap tidak membaca secret; aplikasi fail-closed bila database belum dikonfigurasi. Visual tidak mengubah form/vote maupun data server. |
| Dokumen yang terdampak | `README.md`, `.env.example`, `19-operasional-aplikasi.md`, `engineering/10-deployment.md`, `04-ui-ux-dan-visual.md`, `05-rencana-implementasi.md`, `ui/landing-page.md`, dan entry ini; seluruhnya menyelaraskan Vercel/PostgreSQL, UX, dan proses rilis. |
| Aksi yang dilakukan | Mengganti `node:sqlite` serta path disk dengan `@neondatabase/serverless` dan PostgreSQL; membangun schema idempoten, foreign key, transaksi, hash token, rate limit bersama, idempotency, dan constraint unik server untuk tetap menolak suara ganda di banyak instance Vercel. Mengubah seluruh caller menjadi async/await sehingga action admin baru menyegarkan halaman setelah commit. Menetapkan Node `24.x`, `DATABASE_URL`, serta runbook Vercel/Neon. Audit route build hanya menunjukkan `/`, `/vote`, receipt, admin, tiga API internal, robots, dan sitemap; route informasi legacy tidak dibuat. Menyederhanakan landing menjadi satu scene hutan Motion berorientasi: dua horizon parallax, pointer glow, maksimal tujuh daun, reveal/tilt kandidat; ticker, noise, dan orbit dihapus. |
| Bukti | `npm run typecheck` lulus; `npm run lint` lulus tanpa warning; `npm run build` lulus dengan route inti saja; `git diff --check` tidak menemukan whitespace error. Tidak ada URL database atau data peserta diubah/dibaca. |
| Exit condition | Panitia memasang variable pada Preview/Production, membuat admin Preview, menjalankan UAT database dengan data aman, memverifikasi domain/robots/sitemap, lalu mencatat sign-off sebelum entry dapat `Done`. |
| Keputusan | Siap direview. Tidak boleh membuka voting sampai konfigurasi Vercel/PostgreSQL, import sah, dan gate operasional disetujui. |
| Waktu | Mulai 2026-10-02 WIB; implementasi dan quality gate lokal selesai 2026-10-02 WIB. |

### EXE-20261002-15 — Rancang layar hasil live satu viewport

| Field | Catatan |
| --- | --- |
| Status | `Done` untuk rancangan; implementasi code belum dimulai. |
| Tahap runbook | T9 / layar presentasi hasil. |
| Tujuan | Menentukan layar TV/proyektor yang memperlihatkan jumlah suara seluruh calon dalam satu viewport normal tanpa menjadikan beranda panjang atau menambah dekorasi ke bilik suara. |
| Scope | Kontrak route `/live`, layout 3 × 3, state visibility, polling, motion, aksesibilitas, responsive fallback, SEO, dan acceptance. |
| Out of scope | Membuka hasil, mengubah kebijakan visibility, menambah provider realtime, mempublikasikan NIM/pilihan individual, atau membuat route code sebelum user menyetujui rancangan. |
| Dokumen yang terdampak | `04-ui-ux-dan-visual.md`, `12-rute-dan-seo.md`, `10-quality-gate-dan-pengujian.md`, `ui/README.md`, dan `ui/live-results-display.md`. |
| Keputusan | Gunakan route presentasi `/live`, noindex, tanpa header/footer, dan hanya terhadap agregat yang sudah diizinkan endpoint hasil. Scroll dilarang pada viewport normal namun tersedia saat ukuran/zoom tidak memadai agar aksesibilitas tidak dikorbankan. |
| Bukti | Rancangan tertulis memuat wireframe, kontrak data/state, polling 10 detik, fallback gangguan, responsive matrix, dan acceptance `LIV-01`; tidak ada source/data pemilih diubah. |
| Exit condition | User menyetujui rancangan; entry implementasi baru kemudian menambahkan code, test, dan route audit. |
| Waktu | Mulai dan selesai 2026-10-02 WIB. |

### EXE-20261002-16 — Implementasi layar hasil live satu viewport

| Field | Catatan |
| --- | --- |
| Status | `In review` — implementasi dan quality gate kode selesai; visual/live-data belum dapat diuji karena `DATABASE_URL` lokal belum dikonfigurasi. |
| Tahap runbook | T5/T9 / route hasil presentasi dan UI. |
| Tujuan | Menerapkan rancangan `ui/live-results-display.md` menjadi route `/live` yang menampilkan count semua calon dalam satu viewport normal serta memperbarui snapshot hasil secara aman. |
| Scope | Route/page `noindex`, shell tanpa header/footer, grid 3 × 3, polling API agregat, state visibility/gangguan, motion perubahan angka, responsive fallback, robots, dan test build. |
| Out of scope | Mengubah database, endpoint vote, kebijakan hasil, membuka event, mengubah count, menambah provider realtime, atau memuat data pemilih. |
| Dokumen wajib dibaca | `04-ui-ux-dan-visual.md`, `08-kontrak-api-dan-realtime.md`, `10-quality-gate-dan-pengujian.md`, `12-rute-dan-seo.md`, `ui/live-results-display.md`, dan `engineering/11-accessibility-motion.md`. |
| Risiko dan mitigasi | Layar dapat menampilkan hasil ketika tak diizinkan atau menjadi terlalu padat. Page mengandalkan `election.result`/API yang sudah mematuhi visibility, tidak membuat fallback angka, memakai grid tetap, dan mengizinkan scroll hanya saat ruang/zoom tidak aman. |
| Aksi yang dilakukan | Menambah `/live`, client board hasil, dan shell route-aware agar layar presentasi tidak membawa header/footer situs. Board merender hanya calon published dari snapshot server, memakai grid 3 × 3, count tabular, status koneksi, timestamp WIB, animasi Motion pada tile yang berubah saja, dan fallback hasil belum dipublikasikan. Polling `/api/results` berlangsung setiap 10 detik ketika event awal `open`, memakai backoff 15/30/60 detik saat error, dan berhenti pada snapshot final. `robots.txt` serta metadata route menandai `/live` noindex. |
| Dokumen yang terdampak | `19-operasional-aplikasi.md`, `16-log-eksekusi.md`, `04-ui-ux-dan-visual.md`, `10-quality-gate-dan-pengujian.md`, `12-rute-dan-seo.md`, `ui/README.md`, `ui/live-results-display.md`; source `app/live`, live board, site chrome, metadata, robots, dan CSS. |
| Bukti | `npm run typecheck`, `npm run lint`, dan `npm run build` lulus. Build route audit menunjukkan `/live` dinamis di samping rute inti. `git diff --check` lulus. Pemeriksaan konfigurasi hanya memastikan `DATABASE_URL` belum terisi; nilai rahasia tidak dibaca dan tidak ada request database/vote dijalankan. |
| Exit condition | Panitia memasang database Preview, mengatur visibility hasil pada data aman, lalu mereview 1024 × 768 dan mobile/zoom sebelum entry ini dapat `Done`. |
| Keputusan | Siap direview; route tidak mengubah kebijakan hasil dan tetap fail-closed bila result tidak visible. |
| Waktu | Mulai 2026-10-02 WIB; implementasi dan quality gate kode selesai 2026-10-02 WIB. |

### EXE-20261002-17 — Sederhanakan inisialisasi akun admin

| Field | Catatan |
| --- | --- |
| Status | `In review` — implementasi dan quality gate lokal selesai; belum diuji end-to-end karena database lokal belum dikonfigurasi. |
| Tahap runbook | T5/T7 / autentikasi admin dan konfigurasi deployment. |
| Tujuan | Menghapus interaksi token bootstrap dari UI dan memungkinkan satu akun admin awal dibuat aman dari kredensial server-only. |
| Scope | Username awal baku, password awal environment, login tunggal, dokumentasi konfigurasi, dan quality gate kode. |
| Out of scope | Menaruh password pada source, Git, atau dokumentasi; mengubah password admin yang sudah ada; reset database; mengubah peran/RBAC; atau membuka voting. |
| Dokumen wajib dibaca | `03-data-dan-keamanan.md`, `19-operasional-aplikasi.md`, `engineering/01-security.md`, `engineering/10-deployment.md`, `ui/admin-login.md`, dan panduan Next.js environment variables/server actions. |
| Dokumen yang terdampak | `16-log-eksekusi.md`, `.env.example`, `scripts/create-local-env.mjs`, `19-operasional-aplikasi.md`, `engineering/10-deployment.md`, `12-rute-dan-seo.md`, `ui/admin-login.md`, serta source autentikasi admin. |
| Entry condition | User meminta kredensial admin tetap; password yang pernah dikirim lewat chat diperlakukan sebagai terekspos dan tidak boleh disalin ke artefak proyek. |
| Owner | Pelaksana teknis. |
| Reviewer/approver | Panitia penanggung jawab setup dan admin kedua sebelum environment Production dipasang. |
| Risiko dan mitigasi | Password hardcode akan bocor melalui repository/build. Password awal hanya dibaca dari `ADMIN_INITIAL_PASSWORD` server-only, dibandingkan constant-time, di-hash dengan scrypt sebelum disimpan, dan hanya dapat membuat akun ketika tabel admin masih kosong. |
| Aksi yang dilakukan | Mengganti form setup tiga field menjadi login tunggal; username awal default dipusatkan di server, password awal diverifikasi dari environment, lalu hash disimpan saat akun pertama dibuat. Token bootstrap dan action terkait dihapus. Script local, template environment, runbook deployment, route, dan kontrak UI diperbarui. Audit future memakai event `admin.initialized`. |
| Bukti | `npm run typecheck`, `npm run lint`, dan `npm run build` lulus. Audit build menampilkan hanya route aktif, termasuk `/panitia/login`. `git diff --check` lulus; pencarian source tidak menemukan `ADMIN_BOOTSTRAP_TOKEN` atau `isValidBootstrapToken`. Tidak ada nilai secret dibaca atau ditulis. |
| Exit condition | Panitia mengisi `DATABASE_URL` dan secret baru pada environment Preview, membuktikan login awal dan login ulang dengan database aman, lalu mengesahkan konfigurasi Production. |
| Keputusan | Siap direview. Jangan gunakan password yang sudah pernah dibagikan melalui chat; buat secret baru langsung pada dashboard Vercel. |
| Waktu | Mulai 2026-10-02 WIB; implementasi dan quality gate lokal selesai 2026-10-02 WIB. |

#### Amendment A1

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Alasan perubahan | User meminta perubahan inisialisasi admin didorong ke repository GitHub. |
| Dampak | Commit akan memuat source login, template environment, dan dokumentasi tanpa `.env.local` atau secret. |
| Persetujuan | User. |
| Keputusan | Lanjutkan commit dan push ke branch `main` setelah pemeriksaan status/diff bersih. |

### EXE-20261002-18 — Rancang ulang motion beranda publik

| Field | Catatan |
| --- | --- |
| Status | `In review` — implementasi dan quality gate kode selesai; preview visual lokal menunggu `DATABASE_URL` development yang valid. |
| Tahap runbook | T9 / visual, motion, aksesibilitas, dan performa. |
| Tujuan | Mengganti kesan landing yang statis/generik menjadi pengalaman visual yang lebih fun, friendly, dan terasa hidup melalui React/Motion tanpa mengorbankan kejelasan informasi pemilihan. |
| Scope | Hero/typewriter, section reveal bertahap, kartu informasi, kandidat, langkah voting, hasil, bantuan, token warna/permukaan, serta reduced-motion dan breakpoint beranda. |
| Out of scope | Mengubah poster, data calon, rute, API, hasil, form `/vote`, admin, database, dependency berat, Three.js/canvas/GSAP/Lenis, atau scroll hijacking. |
| Dokumen wajib dibaca | `04-ui-ux-dan-visual.md`, `ui/landing-page.md`, `engineering/11-accessibility-motion.md`, `10-quality-gate-dan-pengujian.md`, dan panduan Next.js Server/Client Components serta lazy loading. |
| Dokumen yang terdampak | `04-ui-ux-dan-visual.md`, `ui/landing-page.md`, `16-log-eksekusi.md`, komponen landing, dan CSS global. |
| Entry condition | User meminta desain lebih fun, interaktif, kaya animasi React, serta typewriter; kontrak reduced-motion dan bilik suara tenang harus tetap dipenuhi. |
| Owner | Pelaksana teknis. |
| Reviewer/approver | Panitia untuk review visual; reviewer aksesibilitas/performa sebelum rilis. |
| Risiko dan mitigasi | Motion berlebihan dapat terasa seperti AI slop, membuat halaman berat, atau mengganggu vote. Setiap motion punya hierarki informasi, dibatasi pada transform/opacity, memakai client island kecil, dimatikan/disederhanakan untuk reduced-motion/touch, dan tidak masuk `/vote`. |
| Aksi yang dilakukan | Menambahkan typewriter hero, tile informasi dengan stagger/hover/tap, journey voting dengan reveal bertahap, count-up hasil dari nilai server nyata, serta surface/ornamen CSS ringan untuk beranda. Semua interaksi browser berada pada client island kecil; page tetap Server Component. Poster calon, data server, dan bilik `/vote` tidak diubah. |
| Bukti | `npm run typecheck`, `npm run lint`, dan `npm run build` lulus; audit build memuat rute inti yang sama. `git diff --check` lulus. Percobaan preview `http://localhost:3000/` berhenti pada error fail-closed karena `DATABASE_URL`/`POSTGRES_URL` tidak diset; tidak ada fallback data atau perubahan database dilakukan. |
| Exit condition | Landing terasa lebih hidup pada perangkat biasa, tetap dapat dibaca tanpa JavaScript/motion, CTA tidak tertunda, poster utuh, quality gate lulus, dan panitia meninjau Preview desktop/mobile/reduced-motion dengan database aman. |
| Keputusan | Siap direview. Gunakan Motion yang telah tersedia; tidak ada library animasi atau aset gambar baru. |
| Waktu | Mulai 2026-10-02 WIB; implementasi dan quality gate lokal selesai 2026-10-02 WIB. |

#### Amendment A1 — Copy publik dan baseline UI/UX internasional

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Alasan perubahan | User meminta teks publik dirancang ulang dengan panduan UI/UX internasional. |
| Dampak | Copy header, hero, beranda, kandidat, langkah, hasil, bantuan, dan footer akan diperjelas; design system mendokumentasikan baseline WCAG 2.2, direct-action copy, target sentuh, focus, serta motion yang dapat dikurangi. |
| Persetujuan | User. |
| Aksi yang dilakukan | Mengganti copy publik menjadi lebih pendek, aktif, dan menjelaskan hasil tindakan; mendokumentasikan baseline W3C WCAG 2.2, Material interaction states, serta content patterns GOV.UK; CTA utama dinaikkan menjadi minimum 48 CSS px. |
| Bukti | `npm run typecheck`, `npm run lint`, `npm run build`, dan `git diff --check` lulus setelah perubahan. Rujukan eksternal dibaca dari sumber resmi dan dicantumkan pada `14-design-system.md`. |
| Keputusan | Lanjutkan perubahan copy dan dokumentasi; tidak mengubah aturan vote, status event, pilihan calon, hasil server, atau data peserta. |

#### Amendment A2 — Commit dan push redesign

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Alasan perubahan | User meminta redesign landing, copy, dan pedoman UI/UX didorong ke GitHub. |
| Dampak | Commit mencakup komponen motion, CSS, copy, dan dokumen visual; tidak mencakup poster, PII, `.env.local`, atau secret. |
| Persetujuan | User. |
| Keputusan | Lanjutkan commit dan push branch `main` setelah staged diff diperiksa. |

### EXE-20261002-19 — Rancang reset peserta dan data simulasi

| Field | Catatan |
| --- | --- |
| Status | `In progress` — rancangan operasional sedang diperbarui; tidak ada database, peserta, atau suara yang diubah. |
| Tahap runbook | T5/T7 / administrasi event dan integritas vote. |
| Tujuan | Menyediakan cara jelas untuk mengosongkan peserta sebelum event serta memulai ulang data uji tanpa menciptakan tombol hapus suara pada production. |
| Scope | Perilaku, pembatas environment, UX Danger Zone, konfirmasi, audit, dan acceptance test untuk reset peserta serta reset simulasi. |
| Out of scope | Menjalankan reset pada database yang ada, menghapus vote production, mengubah database/schema/API, atau membuka voting. |
| Dokumen wajib dibaca | `13-reset-dan-pengulangan-event.md`, `19-operasional-aplikasi.md`, `09-sop-panitia.md`, `10-quality-gate-dan-pengujian.md`, dan `workflow/reset-rerun.md`. |
| Entry condition | User meminta rancangan reset peserta dan suara setelah satu suara uji membuat tombol reset pra-voting terkunci. |
| Owner | Pelaksana teknis. |
| Reviewer/approver | Panitia penanggung jawab event dan admin kedua untuk prosedur production. |
| Risiko dan mitigasi | Tombol reset suara tanpa konteks dapat menghapus bukti election. Reset suara hanya dirancang bagi environment non-production yang diverifikasi; production memakai event pengganti dan arsip. |
| Keputusan sementara | Gunakan tiga aksi eksplisit: `Reset peserta`, `Reset data simulasi`, dan `Buat pemilihan ulang`; jangan gunakan istilah ambigu `Reset voting` pada production. |
| Waktu | Mulai 2026-10-02 WIB. |

#### Amendment A1 — Rancangan guard dan alur selesai

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Aksi yang dilakukan | Mendokumentasikan pemisahan tiga aksi reset, guard server-only untuk data simulasi, urutan transaction, copy Danger Zone, serta acceptance test. |
| Dokumen diperbarui | `13-reset-dan-pengulangan-event.md`, `19-operasional-aplikasi.md`, dan `workflow/reset-rerun.md`. |
| Bukti | `git diff --check` akan dijalankan untuk memastikan perubahan dokumentasi bersih; tidak ada source atau database yang diubah. |
| Keputusan | Siap direview panitia. Implementasi hanya dapat dimulai setelah target environment simulasi dan kebijakan admin kedua disetujui. |

#### Amendment A2 — Scope reset disederhanakan

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Keputusan user | Scope reset dibatasi pada data suara voting dan peserta saja. |
| Dampak rancangan | Panel target memakai reset suara voting terlebih dahulu, kemudian reset peserta; calon, akun admin, konfigurasi kandidat, dan audit tetap dipertahankan. |
| Batas | Aksi hanya untuk local/Vercel Preview test; production tidak menawarkan penghapusan suara. |

#### Amendment A3 — Urutan reset diwajibkan

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Keputusan user | Suara harus dikosongkan lebih dahulu; reset peserta hanya tersedia setelah jumlah suara nol. |
| Dampak rancangan | Ada dua aksi berurutan, masing-masing server-validated dan memiliki audit sendiri. UI menjelaskan penyebab tombol reset peserta terkunci bila masih ada suara. |

#### Amendment A4 — Implementasi disetujui

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Persetujuan | User meminta proses implementasi. |
| Scope implementasi | Schema marker event test, server action reset suara dengan guard environment, server action reset peserta dengan cek jumlah vote, UI admin, template environment, dan pengujian. |
| Batas | Tidak menjalankan reset pada database mana pun; tidak menyediakan endpoint hapus suara pada Production. |

#### Amendment A5 — Implementasi dan quality gate lokal

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Aksi yang dilakukan | Menambah marker `is_test` pada event, guard `APP_ENV`/`VERCEL_ENV`/`ALLOW_SIMULATION_RESET`, reset suara test yang mengembalikan status ke `scheduled`, reset peserta yang menolak bila vote tidak nol, audit, copy Danger Zone berurutan, dan lock event saat verifikasi/submit vote. |
| Bukti | `npm run typecheck`, `npm run lint`, dan `npm run build` lulus. `git diff --check` lulus. |
| Batas pengujian | UAT database tidak dijalankan karena tidak ada database local/Preview yang secara eksplisit dipilih untuk diuji; tidak ada vote/peserta yang diakses atau diubah. |
| Keputusan | Siap direview. Sebelum memakai reset suara, buat database Preview terpisah, set tiga environment variable test, lalu jalankan RST-07 sampai RST-11 dengan data dummy. |

#### Amendment A6 — Commit dan push implementasi reset

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Persetujuan | User meminta perubahan di-push ke GitHub. |
| Dampak | Commit memuat source reset test/peserta, migration marker test, template environment, dan dokumentasi; tidak memuat `.env.local`, database URL, PII, atau secret. |
| Keputusan | Lanjutkan commit dan push branch `main` setelah staged diff diperiksa. |

### EXE-20261002-20 — Tambahkan signature branding konsol

| Field | Catatan |
| --- | --- |
| Status | `In progress` — implementasi kecil dimulai; tidak ada data pengguna atau konfigurasi server yang akan diakses. |
| Tahap runbook | T9 / detail branding non-visual. |
| Tujuan | Menampilkan identitas pembuat di browser console secara ringkas untuk pengembang yang memeriksa situs. |
| Scope | Client component kecil di root layout, pesan `Akhmad Fabiyan`, tautan LinkedIn, dan website pribadi; sekali per tab browser. |
| Out of scope | Watermark visual halaman, analytics, request eksternal, penyimpanan PII, anti-copy, perubahan voting/admin, atau dependency baru. |
| Dokumen wajib dibaca | `04-ui-ux-dan-visual.md`, `14-design-system.md`, `engineering/11-accessibility-motion.md`, dan panduan Next.js Server/Client Components. |
| Entry condition | User meminta watermark branding pada browser console. |
| Risiko dan mitigasi | Console tidak boleh mengandung klaim keamanan atau mengganggu debugging. Pesan berbentuk teks statis, dijalankan satu kali per `sessionStorage`, dan tidak melakukan side effect selain `console.info`. |
| Owner | Pelaksana teknis. |
| Reviewer/approver | User. |
| Keputusan sementara | Gunakan console signature, bukan watermark visual. |
| Waktu | Mulai 2026-10-02 WIB. |

#### Amendment A1 — Implementasi dan quality gate lokal

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Aksi yang dilakukan | Menambahkan `ConsoleSignature` client island pada root layout. Ia menggunakan `sessionStorage` dan guard module runtime agar `console.info` statis hanya tampil sekali per tab. |
| Dokumen diperbarui | `14-design-system.md` dan `16-log-eksekusi.md`. |
| Bukti | `npm run typecheck`, `npm run lint`, `npm run build`, dan `git diff --check` lulus. |
| Batas pengujian | Pesan telah tervalidasi melalui compile/lint/build. Pemeriksaan manual DevTools Console tetap menunggu browser Preview/local dengan database yang dapat merender aplikasi. |
| Keputusan | Siap direview; tidak ada UI, data, request, atau dependency baru. |

#### Amendment A2 — Commit dan push signature konsol

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Persetujuan | User meminta perubahan di-push ke GitHub. |
| Dampak | Commit mencakup client component signature konsol, root layout, dan dokumentasi; tidak mencakup `.env.local`, PII, atau secret. |
| Keputusan | Lanjutkan commit dan push branch `main` setelah staged diff diperiksa. |

#### Amendment A7 — Reset tanpa konfigurasi environment

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Persetujuan | User meminta tombol reset dapat dipakai tanpa mengatur environment variable tambahan. |
| Scope perubahan | Menghapus guard environment dan marker test untuk reset suara; action tetap admin-only, membutuhkan alasan serta konfirmasi teks, mengembalikan event ke `scheduled`, dan tetap berurutan sebelum reset peserta. |
| Risiko dan mitigasi | Reset suara menjadi tersedia pada deployment utama. Perlindungan yang tersisa adalah sesi admin, konfirmasi eksplisit, alasan wajib, audit, dan lock event untuk mencegah vote masuk bersamaan. Tidak ada aksi reset yang dijalankan selama implementasi. |
| Keputusan | Implementasi dimulai; dokumentasi operasional dan deployment harus menghapus langkah konfigurasi yang tidak lagi diperlukan. |

#### Amendment A8 — Dokumentasi tanpa guard environment

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Aksi yang dilakukan | Menghapus referensi setup environment/marker test dari runbook, kontrak data/API, SOP, quality gate, route, fase, dan operasi; mendokumentasikan reset suara → reset peserta sebagai alur admin langsung. |
| Dokumen terdampak | `00`, `07`, `08`, `09`, `10`, `12`, `13`, `15`, `19`, `README`, `engineering/10-deployment.md`, `ui/admin-event.md`, `workflow/reset-rerun.md`, dan `phases/phase-13.md`. |
| Keputusan | Lanjutkan quality gate source; UAT data tetap membutuhkan database yang dipilih panitia dan tidak dijalankan otomatis. |

#### Amendment A9 — Quality gate tanpa environment reset

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Bukti | `npm run typecheck`, `npm run lint`, `npm run build`, dan `git diff --check` lulus setelah guard environment dihapus. |
| Batas pengujian | UAT tidak dijalankan karena tidak ada database yang disetujui untuk dimodifikasi; tidak ada suara atau peserta diakses selama quality gate. |
| Keputusan | Siap direview dan di-deploy. Setelah deploy, admin dapat menjalankan reset suara dengan konfirmasi tanpa menambah environment variable. |

#### Amendment A10 — Commit dan push reset tanpa environment

| Field | Catatan |
| --- | --- |
| Tanggal/WIB | 2026-10-02 WIB |
| Persetujuan | User meminta perubahan di-push ke GitHub. |
| Dampak | Commit memuat source reset tanpa environment guard dan dokumen tata kelola yang diselaraskan; tidak memuat `.env.local`, database URL, PII, maupun secret. |
| Keputusan | Lanjutkan commit dan push branch `main` setelah staged diff diperiksa. |

### Template untuk entry baru

Salin blok ini ke bawah untuk setiap pekerjaan baru. Jangan menghapus entry terdahulu.

```md
### EXE-YYYYMMDD-NN — Judul singkat

| Field | Isi |
| --- | --- |
| Status | Planned / Ready / In progress / In review / Blocked / Approved / Done / Cancelled |
| Tahap runbook | T0–T12 |
| Tujuan | Hasil yang terukur. |
| Scope | Yang dikerjakan. |
| Out of scope | Yang sengaja tidak dikerjakan. |
| Dokumen wajib dibaca | Daftar path dokumen. |
| Dokumen yang terdampak | Daftar path dan alasan. |
| Entry condition | Keputusan, akses, data dummy, atau approval yang diperlukan. |
| Owner | Nama fungsi/akun yang bertanggung jawab. |
| Reviewer/approver | Pihak yang memeriksa; admin kedua bila tindakan sensitif. |
| Risiko dan mitigasi | Risiko yang spesifik, tanpa PII. |
| Aksi yang dilakukan | Ringkasan tindakan dan perubahan file/config. |
| Bukti | Test, log ter-redaksi, screenshot, checksum, PR/commit, atau sign-off. |
| Exit condition | Kriteria selesai/gate berikutnya. |
| Keputusan | Go / no-go / blocked dan alasannya. |
| Waktu | Mulai, selesai, zona waktu WIB. |
```

## Amendment dan insiden

Jika scope berubah setelah pekerjaan mulai, tambahkan subbagian berikut pada entry terkait; jika terjadi insiden event, buat ID baru dan ikuti `09-sop-panitia.md`.

```md
#### Amendment A1

| Field | Isi |
| --- | --- |
| Tanggal/WIB | YYYY-MM-DD HH:MM WIB |
| Alasan perubahan | Fakta yang menyebabkan perubahan. |
| Dampak | Dokumen, kode, data, jadwal, atau risiko yang terdampak. |
| Persetujuan | Pengaju dan penyetuju sesuai otoritas. |
| Keputusan | Lanjut / kembali ke gate / blocked. |
```

## Aturan penutupan entry

Sebelum mengubah entry menjadi `Done`, pastikan:

- [ ] Semua dokumen yang terdampak telah diperbarui dan tautannya valid.
- [ ] Bukti quality gate yang relevan tercantum dan dapat ditemukan pihak berwenang.
- [ ] Tidak ada PII/restricted data yang masuk ke log atau artefak publik.
- [ ] Reviewer yang diperlukan sudah menyetujui.
- [ ] Gate tahap berikutnya disebutkan secara eksplisit.

Jika satu saja belum terpenuhi, gunakan `In review` atau `Blocked`, bukan `Done`.
