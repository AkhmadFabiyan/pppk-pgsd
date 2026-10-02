# UI — Layar Hasil Live `/live`

## Tujuan dan batas

`/live` adalah layar presentasi resmi untuk TV, proyektor, atau perangkat panitia selama hasil boleh dipublikasikan. Ia berbeda dari section hasil pada beranda: tidak memuat kandidat, panduan, navigasi, footer, atau CTA voting sehingga seluruh calon dan jumlah suara dapat terbaca dalam satu viewport.

- Layar ini memakai data aktual dari `GET /api/results`; tidak ada angka contoh, mode demo, atau simulasi.
- Layar ini hanya merender angka ketika `resultVisibility` mengizinkan hasil: `full_live` ketika event `open`, atau `final_only` ketika event `closed`.
- Bila hasil belum boleh tampil, layar hanya menunjukkan status singkat tanpa angka calon. Ia tidak membocorkan count nol maupun daftar calon tersembunyi.
- Layar ini bukan bukti voting, bukan kontrol admin, dan tidak menampilkan NIM, nama pemilih, pilihan individual, IP, token, atau audit.
- Route tidak dimasukkan ke sitemap, navigasi utama, atau search index. URL dibagikan secara langsung oleh panitia kepada operator layar.

## Hierarki satu viewport

Pada perangkat 1024 × 768 atau lebih besar, seluruh konten harus masuk satu viewport tanpa scroll pada zoom browser 100%. Header dan footer situs disembunyikan khusus di route ini agar tidak menghabiskan tinggi layar.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ PGSD 2026 · HASIL LIVE                 126 suara · 28,83% · ● Tersambung │
├────────────────────────────────────────────────────────────────────────┤
│  01  Nama calon                 14    │  02  Nama calon                 9 │
│  03  Nama calon                 18    │  04  Nama calon                11 │
│  05  Nama calon                 12    │  06  Nama calon                20 │
│  07  Nama calon                  7    │  08  Nama calon                22 │
│  09  Nama calon                 13    │                                    │
├────────────────────────────────────────────────────────────────────────┤
│ Pembaruan terakhir 13.42 WIB · Otomatis setiap 10 detik                 │
└────────────────────────────────────────────────────────────────────────┘
```

Grid sebenarnya adalah 3 × 3 pada desktop; diagram hanya menunjukkan kapasitas, bukan urutan tetap. Calon diurutkan berdasarkan jumlah suara menurun. Bila jumlah suara sama, nomor ballot menaik menjadi tie-break deterministik. Perubahan peringkat memakai layout motion singkat, namun selalu langsung tersedia sebagai urutan DOM dan label ARIA; reduced motion menghilangkan perpindahan animatif.

## Data dan state

| Elemen | Sumber | Aturan tampilan |
| --- | --- | --- |
| Nomor, nama, kelas calon | Snapshot server kandidat `published` | Seluruh calon published, diurutkan `voteCount` menurun lalu nomor ballot menaik. Kelas menjadi teks kecil opsional pada layar lebar. |
| Jumlah suara | `result.candidates[].voteCount` | Angka besar, tabular, tanpa animasi dari nilai fiktif. |
| Persentase | `result.candidates[].votePercent` | Teks pendukung; boleh disembunyikan pada layar paling kecil agar jumlah tetap terbaca. |
| Total/partisipasi | `totalCast`, `totalEligible`, `turnoutPercent` | Ringkas di header; tidak ada daftar pemilih. |
| Waktu pembaruan | `updatedAt` | Tanggal kalender, waktu, dan label `WIB` diformat `id-ID` dalam zona `Asia/Jakarta`, baik saat tersambung maupun memakai snapshot terakhir. |
| Koneksi | Hasil request polling | `Tersambung`, `Memperbarui`, atau `Pembaruan tertunda`; tidak pernah menyatakan vote diterima. |

State yang wajib dirender:

1. **Memuat** — sembilan tile skeleton tanpa angka; tinggi sama dengan state normal agar tidak ada layout shift.
2. **Live/final visible** — grid data aktual dan polling aktif hanya selama `open` + `full_live`.
3. **Final** — grid data aktual tetap tampil pada event `closed` + `final_only`; polling berhenti setelah snapshot berhasil.
4. **Belum dipublikasikan** — panel status sederhana, tanpa grid maupun total suara.
5. **Gangguan koneksi** — snapshot terakhir tetap terbaca dan timestamp diberi label `Pembaruan tertunda`; retry memakai backoff, bukan refresh agresif.

## Responsif tanpa scroll default

| Kelas layar | Komposisi | Perlakuan |
| --- | --- | --- |
| ≥1024 px dan tinggi ≥680 px | 3 × 3 | Nomor, nama lengkap, kelas, jumlah, persen; seluruh layar satu viewport. |
| 768–1023 px | 3 × 3 rapat | Kelas disembunyikan; nama maksimum dua baris; jumlah tetap dominan. |
| 480–767 px | 3 × 3 ringkas | Header dua baris; hanya nomor, nama maksimum dua baris, dan jumlah. |
| 320–479 px | 3 × 3 ultra-ringkas | Nomor, nama singkat yang dapat dibaca, dan jumlah; persen serta kelas disembunyikan. |
| Tinggi ekstrem rendah atau zoom ≥200% | Konten boleh scroll | Aksesibilitas lebih penting daripada memotong teks atau menyembunyikan calon. |

Tidak ada poster pada `/live`: sembilan poster tidak dapat dibaca pada satu layar tanpa membuat angka hasil kecil, dan poster bukan data yang dibutuhkan operator layar. Poster tetap tersedia di beranda.

## Arah visual dan motion

- Latar hijau tua padat; garis hutan sangat tipis pada tepi, tidak memakai scene parallax landing page.
- Aksen merah bata hanya pada badge `LIVE` dan perubahan suara; hijau muda untuk status sehat.
- Setiap tile memakai surface solid, nomor ballot, nama, dan angka tabular. Tidak ada gradient pelangi, confetti, bar chart besar, atau card tilt.
- Saat count kandidat berubah dari snapshot server nyata, angka menjalankan highlight opacity/scale maksimal 320 ms. Bila hasil mengubah peringkat, tile berpindah maksimal 380 ms; tie tidak berpindah acak.
- Indikator koneksi boleh berdenyut pelan; semua loop dihentikan oleh `prefers-reduced-motion`.
- Transisi data tidak mengubah tinggi tile atau posisi fokus. Urutan boleh berubah hanya melalui aturan peringkat yang terlihat dan deterministik.

## Polling dan integritas

1. Client memuat snapshot awal dari endpoint yang sama dengan beranda: `/api/results`.
2. Saat event `open` dan data visible, lakukan polling tiap 5 detik dengan `Cache-Control: no-store`; saat `scheduled`, polling tiap 10 detik agar layar siap ketika event dibuka.
3. Saat request gagal, pertahankan snapshot terakhir, tandai tertunda, lalu retry 15 → 30 → 60 detik hingga berhasil.
4. Saat event menjadi `closed`, refetch sekali; jika kebijakan `final_only` mengizinkan, tampilkan snapshot final dan hentikan polling.
5. Hanya data agregat dari API yang dipakai. Tidak ada subscription ke table vote di browser, local counter, atau optimistic increment.

Polling dipilih karena build saat ini belum memiliki provider realtime; ia lebih sederhana untuk dioperasikan di Vercel. Jika provider realtime ditambahkan kelak, channel hanya boleh menggantikan mekanisme pembaruan snapshot, bukan kontrak data atau kontrol visibility.

## Aksesibilitas dan operasi

- Gunakan landmark `main`, satu `h1` yang visually compact, label ARIA untuk tiap tile, dan tabel tersembunyi-visually yang memuat nomor/nama/count/persentase sebagai alternatif screen reader.
- Jangan gunakan `aria-live` untuk seluruh grid. Hanya ringkasan perubahan agregat yang boleh memakai `aria-live="polite"` agar pembaca layar tidak dibanjiri sembilan angka tiap polling.
- Operator dapat menekan `F11` untuk mode layar penuh browser; fitur fullscreen otomatis tidak diperlukan.
- Route mematuhi reduced motion dan keyboard; tidak ada control yang wajib dipakai operator selain refresh browser bila diperlukan.
- Pada display publik, operator memastikan URL tidak memperlihatkan admin/session dan layar dikunci dari input umum.

## Acceptance

- [ ] Pada 1024 × 768, sembilan calon published dan jumlah suaranya tampil tanpa scroll pada zoom 100%.
- [ ] Pada 320 px atau zoom 200%, nama tidak dipotong secara diam-diam; scroll fallback tersedia bila ruang tidak cukup.
- [ ] Count, persentase, total, dan timestamp cocok dengan snapshot `/api/results` pada visibility yang sama.
- [ ] Saat visibility disembunyikan, tidak ada count/persentase/tile hasil yang muncul.
- [ ] Perubahan count hanya menganimasi tile yang benar-benar berubah dan reduced motion mematikan efek non-esensial.
- [ ] Setiap snapshot mengurutkan `voteCount` menurun; jumlah sama memakai nomor ballot menaik dan tidak mengubah urutan secara acak.
- [ ] Route memiliki `noindex`, tidak ada di sitemap/header/footer, dan tidak merender PII atau detail pilihan individual.
- [ ] Gangguan jaringan mempertahankan snapshot terakhir dengan label jujur dan tidak mengarang angka baru.
