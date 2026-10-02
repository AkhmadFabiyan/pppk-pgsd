# UI — Admin Event Workspace

`/panitia` adalah workspace operasional, bukan versi dekoratif dari landing page publik. Panel mengutamakan status event, tindakan paling relevan, data persiapan, monitoring, lalu tindakan sensitif. Semua angka berasal dari server; tidak ada metrik, status, atau hasil demo.

## Struktur layar

1. **Topbar konteks** berisi judul event, status voting tekstual, sesi admin, dan keluar.
2. **Navigasi lokal** menuju `Ringkasan`, `Operasi`, `Peserta`, `Kandidat`, `Monitoring`, dan `Reset`.
3. **Panel tindakan berikutnya** memilih satu CTA navigasi berdasarkan status event, jumlah peserta, dan jumlah kandidat published. Ia tidak melakukan perubahan event langsung.
4. **Kesiapan dan metrik** menyajikan status, peserta eligible, suara diterima, kandidat, serta kebijakan hasil aktual.
5. **Kontrol event** menjaga form buka/tutup dan kebijakan hasil yang ada; server tetap memvalidasi seluruh prasyarat pada submit.
6. **Persiapan** memisahkan import peserta dan publikasi kandidat dari monitoring daftar data.
7. **Monitoring** memuat pencarian peserta, daftar peserta, dan timeline audit.
8. **Danger zone** memakai disclosure native. Reset suara tampil sebelum reset peserta; reset peserta tetap disabled sampai suara nol dan event kembali `scheduled`.

## Responsif dan motion

- Desktop memakai command panel + readiness, strip empat metrik, lalu dua panel persiapan.
- Pada tablet, command panel dan kontrol event menjadi satu kolom tanpa mengubah urutan DOM.
- Pada 767 px ke bawah, navigasi lokal dapat digeser horizontal, CTA/form menjadi lebar penuh, metrik menjadi 2 × 2, dan tabel peserta beralih ke rekaman ringkas. Halaman tidak memaksa tabel desktop dengan scroll horizontal.
- Motion dibatasi pada enter opacity/translasi 8 px, state hover/pressed, dan membuka disclosure. `prefers-reduced-motion` menonaktifkan motion non-esensial.
- Admin tidak memakai parallax, particle, typewriter, confetti, atau counter buatan agar status dan aksi sensitif tetap mudah dibaca.

## Batas integritas

Field name, server action, role, database, mekanisme vote, dan guard reset tidak diubah oleh UI ini. `open` hanya dapat dilakukan setelah secret token tersedia, peserta sudah diimpor, dan minimal dua calon published. Seluruh tindakan tetap tercatat pada audit. Lihat `19-operasional-aplikasi.md` dan `13-reset-dan-pengulangan-event.md`.
