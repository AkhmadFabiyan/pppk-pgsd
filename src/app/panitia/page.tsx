import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, LogOut, RotateCcw, Settings2, UsersRound, Vote } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import {
  candidatePublishAction,
  eventStatusAction,
  importVotersAction,
  logoutAction,
  resetBeforeVotingAction,
  resultVisibilityAction,
  syncCandidatesAction
} from "@/app/panitia/actions";
import { getAdminSummary, getAdminVoters, getAllCandidates } from "@/lib/db";
import { currentAdmin } from "@/lib/security";

export const metadata: Metadata = { title: "Panel Panitia", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ notice?: string; error?: string; q?: string }>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value));
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await currentAdmin();
  if (!admin) return <PageTransition><section className="status-screen"><article className="status-card"><AlertTriangle aria-hidden="true" /><p className="eyebrow eyebrow-red">Akses terbatas</p><h1>Sesi panitia tidak tersedia.</h1><p>Masuk untuk membuka pengaturan pemilihan.</p><Link className="button" href="/panitia/login">Masuk ke panel</Link></article></section></PageTransition>;

  const params = await searchParams;
  const [summary, allCandidates, voters] = await Promise.all([getAdminSummary(), getAllCandidates(), getAdminVoters(params.q)]);
  const resultsByCandidate = new Map(summary.result?.candidates.map((item) => [item.candidateId, item]) ?? []);

  return (
    <PageTransition>
      <main className="admin-page">
        <div className="container admin-shell">
          <header className="admin-header">
            <div><p className="eyebrow eyebrow-green">Panel panitia</p><h1>Pemilihan Ketua Angkatan PGSD 2026</h1><p>Masuk sebagai <strong>{admin.username}</strong>. Perubahan operasional dicatat pada audit internal.</p></div>
            <form action={logoutAction}><button className="button button-outline" type="submit"><LogOut aria-hidden="true" size={16} /> Keluar</button></form>
          </header>

          {params.notice && <p className="form-notice" role="status"><CheckCircle2 aria-hidden="true" size={18} />{params.notice}</p>}
          {params.error && <p className="form-error" role="alert"><AlertTriangle aria-hidden="true" size={18} />{params.error}</p>}

          <section className="admin-summary" aria-label="Ringkasan pemilihan">
            <article><Settings2 aria-hidden="true" /><span>Status</span><strong>{summary.statusLabel}</strong></article>
            <article><UsersRound aria-hidden="true" /><span>Peserta eligible</span><strong>{summary.voterCount}</strong></article>
            <article><Vote aria-hidden="true" /><span>Suara diterima</span><strong>{summary.voteCount}</strong></article>
            <article><UsersRound aria-hidden="true" /><span>Admin aktif</span><strong>{summary.adminCount}</strong></article>
          </section>

          <div className="admin-grid">
            <section className="admin-card admin-card-wide" aria-labelledby="event-control-title">
              <div className="admin-card-heading"><div><p className="eyebrow eyebrow-green">Operasional event</p><h2 id="event-control-title">Buka atau tutup voting</h2></div><span className="admin-status">{summary.statusLabel}</span></div>
              <p>Voting hanya dapat dibuka setelah NIM peserta diimpor, minimal dua calon dipublikasikan, dan <code>VOTING_TOKEN_SECRET</code> tersedia di server.</p>
              <div className="button-row">
                <form action={eventStatusAction}><input type="hidden" name="status" value="open" /><button className="button" type="submit" disabled={summary.status === "open"}>Buka voting</button></form>
                <form action={eventStatusAction}><input type="hidden" name="status" value="closed" /><button className="button button-outline" type="submit" disabled={summary.status === "closed"}>Tutup voting</button></form>
              </div>
              <div className="admin-divider" />
              <h3>Publikasi hasil</h3>
              <p>Hasil tampil sebagai rekap agregat saja; identitas pemilih dan pilihan per orang tidak pernah tampil publik.</p>
              <div className="button-row">
                <form action={resultVisibilityAction}><input type="hidden" name="visibility" value="hidden" /><button className="button button-outline" type="submit" disabled={summary.resultVisibility === "hidden"}>Sembunyikan hasil</button></form>
                <form action={resultVisibilityAction}><input type="hidden" name="visibility" value="full_live" /><button className="button button-outline" type="submit" disabled={summary.resultVisibility === "full_live"}>Tampilkan langsung</button></form>
                <form action={resultVisibilityAction}><input type="hidden" name="visibility" value="final_only" /><button className="button button-outline" type="submit" disabled={summary.resultVisibility === "final_only"}>Tampilkan setelah tutup</button></form>
              </div>
            </section>

            <section className="admin-card" aria-labelledby="voters-title">
              <FileSpreadsheet aria-hidden="true" className="admin-card-icon" />
              <p className="eyebrow eyebrow-green">Daftar pemilih</p><h2 id="voters-title">Impor NIM peserta</h2>
              <p>Unggah file XLSX dengan header <code>NIM</code>, <code>NAMA</code>, dan <code>KELAS</code>. File diganti seluruhnya, hanya sebelum voting dibuka.</p>
              <form className="admin-form" action={importVotersAction}><label>Spreadsheet XLSX<input name="workbook" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required /></label><button className="button" type="submit">Impor daftar peserta</button></form>
            </section>

            <section className="admin-card admin-card-wide" aria-labelledby="voter-list-title">
              <p className="eyebrow eyebrow-green">Master pemilih</p><h2 id="voter-list-title">Daftar peserta terimpor</h2>
              <p>Hanya panitia yang dapat melihat daftar ini. Kolom pilihan calon tidak tersedia di sini.</p>
              <form className="admin-filter" method="get"><label>Cari NIM, nama, atau kelas<input name="q" defaultValue={params.q ?? ""} maxLength={80} /></label><button className="button button-compact" type="submit">Cari</button>{params.q && <Link className="text-link" href="/panitia">Bersihkan</Link>}</form>
              {voters.length ? <div className="admin-table-wrap"><table><thead><tr><th>NIM</th><th>Nama</th><th>Kelas</th><th>TTD</th><th>Hak pilih</th><th>Status</th></tr></thead><tbody>{voters.map((voter) => <tr key={voter.nim}><td>{voter.nim}</td><td>{voter.name}</td><td>{voter.className}</td><td>{voter.attendanceMarked ? "Ada" : "—"}</td><td>{voter.isEligible ? "Eligible" : "Tidak"}</td><td>{voter.hasVoted ? "Sudah memilih" : "Belum memilih"}</td></tr>)}</tbody></table></div> : <p className="admin-empty">Belum ada peserta yang diimpor atau pencarian tidak menemukan hasil.</p>}
            </section>

            <section className="admin-card" aria-labelledby="candidate-control-title">
              <p className="eyebrow eyebrow-red">Daftar calon</p><h2 id="candidate-control-title">Publikasi kandidat</h2>
              <p>Data profil, poster, visi, dan misi bersumber dari katalog proyek. Status publikasi dan sinkronisasi terkunci selama voting dibuka.</p>
              <form className="inline-form" action={syncCandidatesAction}><button className="button button-compact button-outline" type="submit" disabled={summary.status === "open" || summary.voteCount > 0}>Sinkronkan materi calon</button></form>
              <ul className="admin-candidate-list">
                {allCandidates.map((candidate) => {
                  const result = resultsByCandidate.get(candidate.id ?? "");
                  return <li key={candidate.id}><div><strong>{String(candidate.number).padStart(2, "0")} · {candidate.name}</strong><span>{candidate.isPublished ? "Tampil publik" : "Disembunyikan"}{result ? ` · ${result.voteCount} suara` : ""}</span></div><form action={candidatePublishAction}><input type="hidden" name="candidateId" value={candidate.id} /><input type="hidden" name="published" value={candidate.isPublished ? "false" : "true"} /><button className="button button-compact button-outline" type="submit" disabled={summary.status === "open"}>{candidate.isPublished ? "Sembunyikan" : "Publikasikan"}</button></form></li>;
                })}
              </ul>
            </section>

            <section className="admin-card admin-danger" aria-labelledby="reset-title">
              <RotateCcw aria-hidden="true" className="admin-card-icon" />
              <p className="eyebrow eyebrow-red">Reset terkendali</p><h2 id="reset-title">Reset pra-voting</h2>
              <p>Hanya tersedia sebelum voting dibuka dan sebelum ada suara sah. Reset menghapus daftar peserta serta sesi verifikasi, tetapi tidak menghapus calon.</p>
              <form className="admin-form" action={resetBeforeVotingAction}><label>Alasan reset<textarea name="reason" required minLength={8} maxLength={160} /></label><label>Ketik <code>RESET</code> untuk konfirmasi<input name="confirmation" required /></label><button className="button button-danger" type="submit" disabled={summary.status === "open" || summary.voteCount > 0}>Reset pra-voting</button></form>
            </section>

            <section className="admin-card admin-card-wide" aria-labelledby="audit-title">
              <p className="eyebrow eyebrow-green">Audit internal</p><h2 id="audit-title">Aktivitas terbaru</h2>
              {summary.recentAudit.length ? <ol className="audit-list">{summary.recentAudit.map((entry, index) => <li key={`${entry.createdAt}-${index}`}><div><strong>{entry.action}</strong><p>{entry.detail}</p></div><time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time></li>)}</ol> : <p>Belum ada aktivitas tercatat.</p>}
            </section>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
