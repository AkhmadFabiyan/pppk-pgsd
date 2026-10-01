# `votes`

Menyimpan satu vote final: `id`, `election_id`, `voter_id`, `candidate_id`, `submitted_at`, idempotency fingerprint, receipt reference, dan status. Tidak ada update kandidat setelah insert; void memakai record/prosedur terpisah.

Constraint unik `(election_id, voter_id)` dan FK candidate pada election sama. Insert hanya dari transaction service.
