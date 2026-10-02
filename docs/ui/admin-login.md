# UI — Admin Login `/panitia/login`

Hanya untuk role `admin`; halaman memakai error generik, rate limit login berbasis username, password `scrypt`, cookie `httpOnly`/`sameSite=lax`, session delapan jam, dan `noindex`. Saat belum ada admin, login pertama yang cocok dengan `ADMIN_INITIAL_USERNAME` (default `admin@pppk-pgsd.vercel.app`) dan `ADMIN_INITIAL_PASSWORD` server-only akan membuat akun awal. Tidak ada secret environment pada HTML atau log.

MFA belum ada pada build ini dan tidak boleh diklaim sudah aktif. Lihat `19-operasional-aplikasi.md` untuk setup.

Recovery akses mengikuti SOP internal, bukan link publik yang membuka informasi akun.
