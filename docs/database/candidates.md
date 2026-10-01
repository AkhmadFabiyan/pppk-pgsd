# `candidates`

Menyimpan kandidat per event: `id`, `election_id`, `voter_id`, `ballot_number`, `display_name`, `slug`, kelas, asset key, visi, status, timestamps. Misi tersimpan pada `candidate_missions`.

Constraint: nomor urut dan `voter_id` unik per event. Hanya `published` dapat dipilih saat event open. NIM kandidat tidak tampil pada respons public.
