import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="eyebrow">PGSD 2026</p>
          <h2>Ruang pemilihan yang jelas dan bertanggung jawab.</h2>
        </div>
        <div className="footer-links">
          <Link href="/#kandidat">Kandidat</Link>
          <Link href="/#panduan">Panduan voting</Link>
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
