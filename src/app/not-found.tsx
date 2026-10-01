import Link from "next/link";

export default function NotFound() {
  return <section className="status-screen"><article className="status-card"><p className="eyebrow eyebrow-green">404</p><h1>Halaman tidak ditemukan.</h1><p>Periksa kembali tautan atau kembali ke informasi pemilihan.</p><Link className="button" href="/">Kembali ke beranda</Link></article></section>;
}
