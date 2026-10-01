# `admin_users`

Menyimpan akun admin dan metadata authorization: user/provider ID, active status, MFA verified flag, last access, dan scope minimum. Credential rahasia berada di provider auth, bukan tabel aplikasi.

Admin disable tercatat audit. Satu akun tidak dapat menjadi pengaju dan penyetuju aksi sensitive yang sama.
