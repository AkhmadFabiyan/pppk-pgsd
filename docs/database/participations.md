# `participations`

Menyimpan state pemilih per event: verified, vote_started, voted, blocked, atau support_review. Ia membantu recovery tanpa mengekspos pilihan.

Constraint unik `(election_id, voter_id)`. State `voted` dan vote insert diubah atomik dalam transaksi sama.
