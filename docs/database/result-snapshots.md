# `result_snapshots`

Menyimpan agregat yang dapat direkonsiliasi: election, revision, total valid, turnout, candidate counts, generated_at, checksum. Snapshot tidak memuat voter/vote rows.

Dibuat setelah commit transaction atau batch terkontrol. Public realtime/REST hanya memakai representasi snapshot sesuai visibility.
