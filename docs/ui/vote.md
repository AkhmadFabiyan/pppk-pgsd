# UI — Bilik Suara `/vote`

Satu route `/vote`, tiga tahap: **Verifikasi NIM** → **Pilih calon** → **Konfirmasi & kirim**. Status event diperiksa otomatis; receipt adalah output server tahap ketiga, bukan halaman proses tambahan. Server adalah otoritas pada setiap transition.

Input NIM memiliki label, masking sesuai kebijakan, error netral, dan tidak disimpan client/log. Satu tahap aktif dalam satu waktu. Submit disabled saat tidak valid; user dapat kembali sebelum final confirmation. Jangan tampilkan hasil personal sesudah submit.

Copy tahap mengikuti pola `Masukkan NIM` → `Pilih satu calon` → `Cek pilihanmu`. CTA berurutan adalah `Cek NIM`, `Ke konfirmasi`, dan `Kirim suara`; loading memakai bentuk proses `Mengecek`/`Mengirim`. Pesan gagal menyebut keadaan dan langkah pemulihan singkat tanpa mengungkap keberadaan, pilihan, atau data pemilih lain. Receipt hanya boleh menyatakan `Suaramu diterima` setelah server memberi kode bukti.

Motion pada bilik suara hanya memberikan orientasi: panel tahap baru masuk melalui opacity/translate singkat, pilihan ballot memberi feedback tap ringan, dan heading tahap baru menerima fokus keyboard. Tidak ada GSAP, parallax, animation loop, hasil live, maupun dekorasi hutan pada route ini. `prefers-reduced-motion` membuat perpindahan langsung tanpa mengubah urutan atau fokus.
