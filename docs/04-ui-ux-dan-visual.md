# 04. UI/UX Produk Siap Pakai

Dokumen ini adalah kontrak UI/UX untuk aplikasi voting PGSD 2026 yang benar-benar akan dipakai. Ia menggantikan arah visual prototipe terdahulu. Bila ada konflik dengan dokumen visual lama, dokumen ini yang berlaku.

## Keputusan produk

- Tidak ada label, tombol, angka, kandidat, receipt, atau hasil **demo**, **preview**, atau **simulasi** pada aplikasi yang dapat diakses pemilih.
- Semua tampilan memakai konfigurasi event aktual dan data berstatus `published`/`open` yang berasal dari server. Jika event belum dapat dipakai, tampilkan status sebenarnya: `Terjadwal`, `Belum dibuka`, `Sedang berlangsung`, `Ditutup`, atau `Gangguan`.
- Tidak ada data fiktif sebagai fallback publik. Kegagalan data menampilkan error yang jujur dan kanal bantuan, bukan angka atau kartu pengganti.
- Setiap layar harus terasa seperti alat pemilihan resmi: ringkas, stabil, mudah dibaca, dan tidak meminta pengguna menebak tindakan berikutnya.
- Animasi memperjelas perpindahan state dan respons interaksi; animasi tidak pernah menyembunyikan informasi, menunda CTA, atau menentukan validitas suara.

Lingkungan local/staging tetap boleh memakai data uji untuk pengujian internal, tetapi tidak boleh diberi domain, metadata, atau akses publik yang dapat disalahartikan sebagai pemilihan resmi.

## Arah visual

Tema adalah **hutan institusional yang fun**: hijau tua memberi rasa tenang dan kredibel, merah bata memberi penekanan pada keputusan penting. Hutan hadir sebagai satu scene orientasi di beranda—siluet kanopi, kedalaman scroll ringan, glow responsif pointer desktop, dan sedikit daun—bukan kumpulan efek atau dekorasi yang mengalahkan konten.

| Hindari | Wajib digunakan |
| --- | --- |
| Hero generik, slogan metaforis panjang, atau copy pemasaran kosong. | Nama event, periode WIB, status resmi, dan CTA yang jelas. |
| Glassmorphism berlapis, glow berlebihan, 3D berat, confetti, ticker tanpa informasi, noise/grain, atau efek cursor yang menghambat navigasi. | Surface padat, grid rapi, garis batas tipis, kontras tinggi, gambar calon asli, serta satu motion cue yang membantu orientasi. |
| Gradient pelangi, warna acak, atau banyak aksen dalam satu layar. | Hijau sebagai identitas; merah hanya untuk fokus/aksi destruktif; warna status semantik. |
| Kartu dengan tinggi tidak konsisten atau poster dipotong sembarang. | Grid dengan rasio media konsisten, nomor urut, nama, dan CTA tetap. |
| Transisi layar penuh, scroll yang dimanipulasi, atau efek yang memperlambat form. | Native scroll, navigasi langsung, dan transisi singkat berbasis opacity/transform. |

## Sistem desain

### Token warna

| Token | Nilai | Peran |
| --- | --- | --- |
| `forest-950` | `#0B2417` | Header, footer, dan bidang gelap. |
| `forest-800` | `#123A2A` | Navigasi aktif dan panel gelap. |
| `forest-700` | `#166534` | CTA primer dan state aktif. |
| `moss-200` | `#DCEBCF` | Badge/permukaan hijau terang. |
| `bone-50` | `#F7F6F1` | Latar utama dan bidang baca. |
| `ink-950` | `#172018` | Teks utama pada permukaan terang. |
| `brick-600` | `#B9382F` | Aksen terukur, peringatan, dan aksi berisiko. |
| `danger-700` | `#B42318` | Error, selalu bersama ikon dan teks. |
| `success-700` | `#18794E` | Sukses, selalu bersama ikon dan teks. |

Gunakan satu keluarga sans-serif yang cepat dimuat (system/Geist) dengan berat `400`, `500`, `600`, dan `700`. Tidak ada font display atau serif dekoratif. Ukuran teks dasar 16 px, tinggi baris isi minimum 1.5, dan angka hasil memakai tabular numbers.

### Komponen dan layout

- Container publik: lebar maksimum 1200 px, gutter 16 px pada mobile, 24 px tablet, dan 32 px desktop.
- Header: tinggi 64 px mobile dan 72 px desktop; logo/nama event, navigasi penting, dan CTA `Gunakan suara` hanya saat event `open`.
- Tombol: tinggi minimum 44 px, radius 10 px, satu tombol primer per section. State hover, focus, disabled, loading, dan error harus tersedia.
- Input: label selalu terlihat di atas field; petunjuk dan error berada tepat di bawahnya; NIM tidak ditulis ke URL, localStorage, analytics, atau log browser.
- Card kandidat: poster asli dengan rasio sumber utuh, nomor urut, nama, kelas bila disetujui, serta tombol `Lihat visi dan misi` yang membuka detail inline pada beranda. Seluruh card tidak boleh menjadi tombol vote.
- Ballot option: radio native/aksesibel dengan border, label `Dipilih`, dan ringkasan calon. State terpilih dapat dipahami tanpa warna.
- Dialog konfirmasi: ringkasan pilihan, tindakan `Kembali` dan `Kirim suara`, focus trap, Escape, serta focus return ke pemicu.
- Hasil: tabel angka adalah sumber utama; bar hanya membantu membaca. Urutan calon mengikuti nomor ballot dan tidak bergeser ketika angka berubah.

## Rute dan perilaku layar

| Rute | Tujuan dan tindakan utama | State aktual yang wajib ditangani |
| --- | --- | --- |
| `/` | Satu beranda visitor: status, kandidat, visi-misi inline, panduan, hasil, bantuan, dan privasi ringkas. | Terjadwal, open, closed, maintenance, hasil disembunyikan. |
| `/vote` | Verifikasi → pilih → konfirmasi → receipt. | Belum buka, validasi gagal, sudah memilih, koneksi gagal, sukses. |
| `/bukti/[receiptCode]` | Menyimpan kode bukti dan arah bantuan. | Valid, kadaluwarsa/tidak valid tanpa membocorkan data. |
| `/panitia/*` | Operasi admin terlindungi. | Belum login, MFA, unauthorized, audit/reauth untuk aksi berisiko. |

Tidak ada route informasi visitor lain selain `/`; kandidat, panduan, hasil, bantuan, dan privasi hanya berupa section beranda. URL legacy yang tidak terpakai sengaja tidak dipertahankan.

### Landing

Viewport pertama memuat status event, judul `Pemilihan Ketua Angkatan PGSD 2026`, periode WIB, dan satu CTA yang sesuai state. Saat `open`, CTA adalah `Gunakan suara`; saat belum buka/ditutup, CTA mengarah ke section kandidat atau panduan. Di bawahnya, beranda menyusun kandidat, proses voting, hasil, bantuan, dan privasi dalam section pendek dengan anchor yang jelas. Tampilan hasil hanya muncul bila kebijakan hasil mengizinkannya.

### Kandidat

Kandidat ditampilkan dengan poster dari folder aset yang sudah disetujui panitia. Tombol pada card membuka panel detail inline berisi transkrip visi-misi; tidak ada perpindahan halaman. Grid: satu kolom sampai 639 px, dua kolom pada 640–1023 px, dan tiga kolom dari 1024 px. Bila sembilan kandidat tetap digunakan, baris terakhir tidak dipaksa melebar atau diberi dekorasi filler.

### Bilik suara

Bilik suara adalah layar paling tenang: tanpa countdown animatif, skor live, parallax, atau iklan kandidat. Ia selalu memakai satu route `/vote` dengan tiga tahap linear:

1. **Verifikasi NIM** — sistem memeriksa event, eligibility, status suara, rate limit, serta faktor kedua bila kebijakan meminta.
2. **Pilih calon** — pemilih memilih satu radio ballot dan dapat membaca ringkasan visi-misi tanpa meninggalkan route.
3. **Konfirmasi & kirim** — ringkasan akhir, satu aksi `Kirim suara`, loading server, lalu redirect otomatis ke receipt jika diterima.

Receipt bukan tahap halaman tambahan bagi pemilih; ia adalah output server setelah tahap ketiga sukses. Pada mobile, tombol tahap aktif tetap mudah dijangkau dengan sticky action bar yang tidak menutup field, error, atau navigation browser. Pengguna dapat kembali sebelum konfirmasi final; sesudah server menerima suara, aksi kirim tidak boleh dapat diulang.

### Hasil

Hasil live hanya menggunakan agregat yang disetujui: jumlah suara, persentase, total suara sah, partisipasi, waktu pembaruan terakhir, dan status koneksi. Tidak pernah menampilkan daftar pemilih, pilihan individual, NIM, IP, atau fingerprint. Saat realtime gagal, angka terakhir tetap diberi timestamp dan status `Pembaruan tertunda`; tidak ada counter atau data buatan.

### Admin

Admin memakai layout kerja yang terang, padat, dan tidak bertema dekoratif. Navigasi samping desktop berubah menjadi sheet mobile. Area utama fokus pada status event, kandidat, import eligible, audit, hasil, dan reset terkontrol. Aksi buka, tutup, reset, import, publish, serta export selalu meminta alasan, re-auth/konfirmasi sesuai SOP, dan meninggalkan audit log.

## Responsif dan aksesibilitas

| Lebar | Aturan |
| --- | --- |
| 320–479 px | Satu kolom; teks tidak terpotong; menu sheet; action bar hanya untuk CTA tahap aktif. |
| 480–767 px | Satu/dua kolom sesuai lebar aman; poster dan form tetap memiliki gutter 16 px. |
| 768–1023 px | Grid dua kolom; navigasi dapat horizontal; form voting tetap maksimum 640 px. |
| 1024–1279 px | Grid tiga kolom; hero ringkas dua kolom; sidebar admin tetap terlihat. |
| ≥1280 px | Container maksimum 1200 px; informasi tidak direnggangkan untuk memenuhi layar besar. |

Seluruh rute wajib lolos keyboard-only, zoom 200%, screen reader dasar, orientasi portrait/landscape, jaringan lambat, dan `prefers-reduced-motion`. Target sentuh minimum 44 × 44 px. Ada skip link, satu `h1` per halaman, landmark semantik, focus ring kontras, dan error yang diumumkan tanpa mengungkap PII.

## Kontrak motion

Halaman publik boleh terasa sinematik dan eksploratif, tetapi bilik suara tetap tenang. Default implementasi adalah CSS transition dan Motion; semua layer dekoratif memakai transform/opacity, tidak mengirim sinyal pointer ke server, dan tidak menunda CTA atau konten penting. GSAP, Lenis, Three.js, React Three Fiber, canvas, particle engine, dan autoplay audio **tetap tidak masuk rilis ini**.

| ID | Kejadian | Durasi | Aturan |
| --- | --- | --- | --- |
| `MOT-01` | Halaman/navigasi selesai dimuat | 180–240 ms | Fade/translate maksimal 8 px; konten dan CTA sudah dapat dipakai tanpa menunggu. |
| `MOT-02` | Hover/focus/tap tombol atau card | 120–180 ms | Warna, border, atau translate maksimal 2 px; tidak ada layout shift. |
| `MOT-03` | Card kandidat masuk viewport | 180–240 ms, sekali | Hanya opacity/transform; pada mobile rendah daya boleh statis. |
| `MOT-04` | Pilihan radio dan dialog konfirmasi | 160–220 ms | Focus dan state semantik aktif sebelum animasi selesai. |
| `MOT-05` | Angka hasil berubah dari data server | 250–400 ms | Transisi dari nilai snapshot nyata; teks numerik langsung tersedia. |
| `MOT-06` | Receipt sukses | maksimal 500 ms | Ikon cek sederhana; kode receipt tetap muncul sejak awal. |
| `MOT-07` | Landing page discroll | transform berbasis posisi scroll | Progress tipis, dua layer horizon, dan reveal section; tidak dipakai pada `/vote`. |
| `MOT-08` | Pointer melintasi landing/kartu calon | 100–280 ms | Glow lokal dan tilt ringan; touch device tidak membutuhkan pointer untuk memperoleh informasi. |

Pada `prefers-reduced-motion`, semua motion non-fungsional dihapus; perubahan state esensial memakai transisi opacity singkat atau langsung. Loop dekoratif hanya boleh berada pada landing page dan harus berhenti pada reduced motion. Tidak ada autoplay scroll, inertia scroll, atau dekorasi bergerak di bilik suara.

## Acceptance sebelum implementasi dianggap selesai

- [ ] Tidak ada string, badge, route, metadata, seed publik, atau hasil yang menyebut/menggunakan demo, preview, dummy, dan simulasi pada deployment produksi.
- [ ] Semua state berasal dari konfigurasi server dan data published; kegagalan tidak diganti data fiktif.
- [ ] CTA, status event, kandidat, serta hasil mengikuti kebijakan event aktual dan dapat diuji dari 320 px hingga desktop lebar.
- [ ] Bilik suara dapat diselesaikan dengan keyboard dan layar sentuh tanpa animasi yang mengganggu atau data tersimpan di browser.
- [ ] Motion memenuhi kontrak di atas, menghormati reduced motion, dan tidak membuat CLS atau input delay yang terlihat.
- [ ] Semua layar memakai poster calon asli yang telah disetujui; tidak ada foto calon buatan AI atau aset placeholder pada production.
- [ ] Review visual panitia membuktikan hierarki informasi, kontras, dan copy profesional sebelum event dibuka.

Spesifikasi per layar yang lebih operasional ada pada folder `ui/`; arsitektur dan urutan delivery ada pada `05-rencana-implementasi.md` serta `phases/`.
