# `voters`

Menyimpan master restricted: `id`, `nim` string terenkripsi/terlindungi sesuai provider, nama internal, kelas, import source, status, timestamps. Nama/NIM tidak boleh dipilih oleh query publik.

Constraint: NIM unik global atau sesuai kebijakan institusi. Normalisasi berlaku saat import, namun nilai canonical tidak kehilangan leading zero.
