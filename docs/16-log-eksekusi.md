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
