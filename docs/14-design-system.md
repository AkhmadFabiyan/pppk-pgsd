# Design System Voting PGSD 2026

Satu sistem komponen dipakai oleh visitor dan admin; perbedaannya hanya density dan izin data, bukan identitas visual yang berubah-ubah. Rujukan utama adalah `04-ui-ux-dan-visual.md`.

## Aturan inti

- UI production hanya memuat status event dan data nyata dari server; tidak ada placeholder, demo, atau hasil fiktif sebagai fallback.
- Gunakan `forest-*` untuk identitas, `bone-50` untuk bidang baca, `brick-600` untuk penekanan, serta token semantic `success`/`danger` untuk feedback. Warna tidak pernah menjadi satu-satunya pembeda state.
- Typography adalah satu keluarga sans-serif system/Geist; satu `h1` per layar; minimum 16 px untuk isi dan line-height 1.5.
- Target sentuh minimum 44 px, focus ring kontras, label form selalu terlihat, dan setiap dialog memiliki trap/return focus.
- Radius: 10 px field/button, 14 px card; shadow hanya elevasi ringan. Tidak ada glass, glow dekoratif, gradient pelangi, atau shape acak.

## Primitive wajib

`AppHeader`, `StatusBadge`, `Button`, `TextField`, `NimField`, `CandidateCard`, `BallotOption`, `ConfirmDialog`, `ResultTable`, `ResultBar`, `Alert`, `Toast`, `EmptyState`, `ErrorState`, dan `AdminTable`.

Setiap primitive memiliki state default, hover (pointer saja), focus-visible, disabled, loading, error, serta reduced motion bila relevan. Semua komponen visual menerima data siap tampil; mereka tidak menjalankan otorisasi, submit voting, atau mengubah hasil.

## Responsif

Container publik maksimum 1200 px dengan gutter 16/24/32 px. Beranda publik memakai anchor navigation; grid kandidat 1/2/3 kolom dan panel visi-misi inline sesuai breakpoint dalam spesifikasi UI. Form voting maksimum 640 px supaya fokus dan mudah dibaca. Sidebar admin menjadi sheet pada layar di bawah 1024 px.

## Motion

Gunakan CSS transition dan Motion untuk state/feedback berjangka 120–400 ms. Hormati `prefers-reduced-motion`; dilarang memakai canvas, parallax, Lenis, particle, autoplay, atau animasi loop pada rilis pertama. Kontrak lengkap ada pada `04-ui-ux-dan-visual.md`.
