import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { bootstrapAdminAction, loginAction } from "@/app/panitia/actions";
import { hasAdminUsers } from "@/lib/db";
import { currentAdmin } from "@/lib/security";

export const metadata: Metadata = { title: "Akses Panitia", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string }>;

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const [admin, params] = await Promise.all([currentAdmin(), searchParams]);
  const setupRequired = !(await hasAdminUsers());

  return (
    <PageTransition>
      <section className="admin-auth-page">
        <article className="admin-auth-card">
          <LockKeyhole aria-hidden="true" />
          <p className="eyebrow eyebrow-green">Area terbatas</p>
          <h1>{setupRequired ? "Buat akses panitia pertama." : "Masuk ke panel panitia."}</h1>
          <p>{setupRequired ? "Gunakan token bootstrap dari konfigurasi server. Token ini hanya dipakai sekali saat membuat admin awal." : "Gunakan akun panitia yang telah didaftarkan. Aktivitas penting dicatat di audit internal."}</p>
          {params.error && <p className="form-error" role="alert">{params.error}</p>}
          {admin ? (
            <Link className="button" href="/panitia">Buka panel panitia</Link>
          ) : setupRequired ? (
            <form className="admin-form" action={bootstrapAdminAction}>
              <label>Username<input name="username" autoComplete="username" required minLength={3} maxLength={40} pattern="[a-zA-Z0-9._-]+" /></label>
              <label>Kata sandi<input name="password" type="password" autoComplete="new-password" required minLength={12} /></label>
              <label>Token bootstrap<input name="setupToken" type="password" autoComplete="off" required /></label>
              <button className="button" type="submit">Buat akun admin</button>
            </form>
          ) : (
            <form className="admin-form" action={loginAction}>
              <label>Username<input name="username" autoComplete="username" required /></label>
              <label>Kata sandi<input name="password" type="password" autoComplete="current-password" required /></label>
              <button className="button" type="submit">Masuk</button>
            </form>
          )}
          <Link className="text-link" href="/">Kembali ke beranda</Link>
        </article>
      </section>
    </PageTransition>
  );
}
