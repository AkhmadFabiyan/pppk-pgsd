# UI — Admin Login `/panitia/login`

Hanya untuk role `admin`; halaman memakai error generik, rate limit login berbasis username, password `scrypt`, cookie `httpOnly`/`sameSite=lax`, session delapan jam, dan `noindex`. Akun pertama hanya dibuat melalui `ADMIN_BOOTSTRAP_TOKEN` dari environment server. Tidak ada petunjuk keberadaan email/akun sebelum authorization selesai.

MFA belum ada pada build ini dan tidak boleh diklaim sudah aktif. Lihat `19-operasional-aplikasi.md` untuk setup.

Recovery akses mengikuti SOP internal, bukan link publik yang membuka informasi akun.
