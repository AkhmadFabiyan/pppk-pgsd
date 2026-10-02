# Design System Voting PGSD 2026

Satu sistem komponen dipakai oleh visitor dan admin; perbedaannya hanya density dan izin data, bukan identitas visual yang berubah-ubah. Rujukan utama adalah `04-ui-ux-dan-visual.md`.

## Aturan inti

- UI production hanya memuat status event dan data nyata dari server; tidak ada placeholder, demo, atau hasil fiktif sebagai fallback.
- Gunakan `forest-*` untuk identitas, `bone-50` untuk bidang baca, `brick-600` untuk penekanan, serta token semantic `success`/`danger` untuk feedback. Warna tidak pernah menjadi satu-satunya pembeda state.
- Typography adalah satu keluarga sans-serif system/Geist; satu `h1` per layar; minimum 16 px untuk isi dan line-height 1.5.
- Target sentuh minimum 44 px untuk seluruh control dan 48 px untuk CTA utama, focus ring kontras, label form selalu terlihat, dan setiap dialog memiliki trap/return focus.
- Radius: 10 px field/button, 14 px card; shadow hanya elevasi ringan. Tidak ada glass, glow dekoratif, gradient pelangi, atau shape acak.

## Baseline UI/UX internasional

Baseline implementasi menggunakan prinsip berikut sebagai guardrail, bukan untuk meniru tampilan produk lain:

| Rujukan | Penerapan pada PGSD 2026 |
| --- | --- |
| W3C WCAG 2.2 Level AA | Informasi tidak hanya disampaikan oleh warna/motion; label, fokus keyboard, error, struktur heading, kontras, dan reduced motion wajib diuji. Typewriter bersifat dekoratif dan memiliki teks lengkap untuk pembaca layar. |
| W3C WCAG 2.2 target/interaksi | Kontrol inti tetap mudah disentuh, memiliki area interaksi lapang, dan tidak meminta gesture rumit. Tombol CTA utama memakai tinggi minimum 48 CSS px; jalur vote dapat diselesaikan keyboard. |
| Material Design interaction patterns | Setiap control memiliki state default, hover (pointer), pressed, focus-visible, disabled, dan loading yang dapat dimengerti tanpa menunggu animasi. Motion hanya memberi feedback, tidak menjadi instruksi. |
| GOV.UK content patterns | Copy memakai kata kerja langsung, satu tindakan utama per section, kalimat pendek, istilah yang dijelaskan pada pemakaian pertama, serta informasi penting sebagai teks HTML—bukan isi poster/dekorasi. |

Sumber referensi: [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/), [Material Design 3 Interaction States](https://m3.material.io/foundations/interaction/states/overview), dan [GOV.UK Design System Styles](https://design-system.service.gov.uk/styles/). Rujukan ini tidak menggantikan kebijakan integritas/privasi pada `02-alur-voting.md` dan `03-data-dan-keamanan.md`.

## Primitive wajib

`AppHeader`, `StatusBadge`, `Button`, `TextField`, `NimField`, `CandidateCard`, `BallotOption`, `ConfirmDialog`, `ResultTable`, `ResultBar`, `Alert`, `Toast`, `EmptyState`, `ErrorState`, dan `AdminTable`.

Setiap primitive memiliki state default, hover (pointer saja), focus-visible, disabled, loading, error, serta reduced motion bila relevan. Semua komponen visual menerima data siap tampil; mereka tidak menjalankan otorisasi, submit voting, atau mengubah hasil.

## Responsif

Container publik maksimum 1200 px dengan gutter 16/24/32 px. Beranda publik memakai anchor navigation; grid kandidat 1/2/3 kolom dan panel visi-misi inline sesuai breakpoint dalam spesifikasi UI. Form voting maksimum 640 px supaya fokus dan mudah dibaca. Sidebar admin menjadi sheet pada layar di bawah 1024 px.

## Motion

Gunakan CSS transition dan Motion untuk state/feedback berjangka 120–400 ms. Hormati `prefers-reduced-motion`; dilarang memakai canvas, parallax, Lenis, particle, autoplay, atau animasi loop pada rilis pertama. Kontrak lengkap ada pada `04-ui-ux-dan-visual.md`.
