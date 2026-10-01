# Vote Integrity

Submit vote menggunakan satu transaksi database: kunci eligibility/participation, validasi event open dan candidate published, insert vote, tandai participation, buat receipt, tambah revision agregat. Unique constraint adalah pertahanan terakhir, bukan hanya pengecekan UI.

Idempotency key mengembalikan hasil pertama untuk retry payload sama. Request paralel dengan NIM sama menghasilkan tepat satu vote sah. Lihat `database/votes.md` dan acceptance `VOT-01`–`VOT-06`.
