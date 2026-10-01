# `eligibilities`

Menghubungkan `election_id` dan `voter_id`: `is_eligible`, reason, imported_at, locked_at. Tabel ini memisahkan master peserta dari hak pilih event.

Constraint unik `(election_id, voter_id)`. Saat event open, eligibility tidak diubah kecuali prosedur exception ber-audit.
