# `elections`

Menyimpan event: `id`, `slug`, `title`, `status`, `opens_at`, `closes_at`, `timezone`, `result_visibility`, `revision`, `replaced_election_id`, timestamps. Status mengikuti state machine draft → scheduled → open → closed → archived.

Constraint: slug unik, waktu valid, dan event open tidak boleh dihapus. Perubahan status/admin tercatat di audit.
