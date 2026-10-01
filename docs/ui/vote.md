# UI — Bilik Suara `/vote`

Satu route `/vote`, tiga tahap: **Verifikasi NIM** → **Pilih calon** → **Konfirmasi & kirim**. Status event diperiksa otomatis; receipt adalah output server tahap ketiga, bukan halaman proses tambahan. Server adalah otoritas pada setiap transition.

Input NIM memiliki label, masking sesuai kebijakan, error netral, dan tidak disimpan client/log. Satu tahap aktif dalam satu waktu. Submit disabled saat tidak valid; user dapat kembali sebelum final confirmation. Jangan tampilkan hasil personal sesudah submit.
