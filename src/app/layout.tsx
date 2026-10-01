import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollProgress } from "@/components/scroll-progress";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Pemilihan Ketua Angkatan PGSD 2026",
    template: "%s | Voting PGSD 2026"
  },
  description: "Informasi kandidat, panduan, dan status resmi Pemilihan Ketua Angkatan PGSD 2026.",
  applicationName: "Voting PGSD 2026",
  robots: { index: true, follow: true },
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Pemilihan Ketua Angkatan PGSD 2026",
    description: "Informasi kandidat, panduan, dan status resmi Pemilihan Ketua Angkatan PGSD 2026."
  }
};

export const viewport: Viewport = {
  themeColor: "#0B2417",
  colorScheme: "light"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#main-content">Langsung ke isi</a>
        <ScrollProgress />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
