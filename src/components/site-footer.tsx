import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="eyebrow">PGSD 2026</p>
          <h2>Pilih dengan jelas. Jaga suara dengan baik.</h2>
        </div>
        <div className="footer-links">
          <Link href="/#kandidat">Kandidat</Link>
          <Link href="/#panduan">Cara memilih</Link>
          <Link href="/#bantuan">Bantuan</Link>
          <Link href="/#privasi">Kebijakan privasi</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 PGSD. Informasi pemilihan dikelola oleh panitia.</span>
        <Link href="/panitia/login">Akses panitia</Link>
      </div>
    </footer>
  );
}
