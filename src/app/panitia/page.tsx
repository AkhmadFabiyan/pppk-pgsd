import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Eye,
  FileSpreadsheet,
  LogOut,
  RotateCcw,
  Settings2,
  ShieldCheck,
  UsersRound,
  Vote
} from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import {
  candidatePublishAction,
  eventStatusAction,
  importVotersAction,
  logoutAction,
  resetVotesAction,
  resetVotersAction,
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

function resultVisibilityLabel(visibility: "hidden" | "full_live" | "final_only") {
  if (visibility === "full_live") return "Tampil langsung";
  if (visibility === "final_only") return "Setelah voting ditutup";
  return "Disembunyikan";
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await currentAdmin();
  if (!admin) {
    return <PageTransition><section className="status-screen"><article className="status-card"><AlertTriangle aria-hidden="true" /><p className="eyebrow eyebrow-red">Akses terbatas</p><h1>Sesi panitia tidak tersedia.</h1><p>Masuk untuk membuka pengaturan pemilihan.</p><Link className="button" href="/panitia/login">Masuk ke panel</Link></article></section></PageTransition>;
  }

  const params = await searchParams;
  const [summary, allCandidates, voters] = await Promise.all([getAdminSummary(), getAllCandidates(), getAdminVoters(params.q)]);
  const resultsByCandidate = new Map(summary.result?.candidates.map((item) => [item.candidateId, item]) ?? []);
  const publishedCandidateCount = allCandidates.filter((candidate) => candidate.isPublished).length;
  const canResetVoters = summary.voteCount === 0 && summary.status === "scheduled";
  const statusMessage = summary.status === "open"
    ? "Voting sedang menerima suara. Perubahan peserta dan kandidat tetap dikunci."
    : summary.status === "closed"
      ? "Voting sudah ditutup. Tinjau hasil dan audit sebelum membuat perubahan lanjutan."
      : "Event masih terjadwal. Lengkapi peserta dan kandidat sebelum membuka voting.";
  const nextAction = summary.status === "open"
    ? { eyebrow: "Event aktif", title: "Pantau, lalu tutup pada waktu yang ditetapkan.", body: "Suara masuk dapat dipantau tanpa membuka atau mengubah data pemilih.", href: "#operasi", label: "Tinjau kontrol voting" }
    : summary.status === "closed"
      ? { eyebrow: "Event selesai", title: "Tinjau hasil dan jejak operasional.", body: "Pastikan kebijakan hasil dan catatan audit sudah sesuai sebelum menindaklanjuti event.", href: "#monitoring", label: "Buka monitoring" }
      : summary.voterCount === 0
        ? { eyebrow: "Mulai persiapan", title: "Impor daftar peserta terlebih dahulu.", body: "Voting hanya dapat dibuka setelah daftar eligible tersedia di sistem.", href: "#peserta", label: "Kelola peserta" }
        : publishedCandidateCount < 2
          ? { eyebrow: "Persiapan kandidat", title: "Lengkapi kandidat yang akan tampil.", body: "Setidaknya dua kandidat published diperlukan sebelum event dibuka.", href: "#kandidat", label: "Kelola kandidat" }
          : { eyebrow: "Siap diperiksa", title: "Prasyarat tampilan sudah lengkap.", body: "Tinjau kontrol event. Server akan mengecek secret dan data terakhir saat voting dibuka.", href: "#operasi", label: "Tinjau kontrol voting" };

  return (
    <PageTransition>
      <main className="admin-page">
        <div className="container admin-shell">
          <header className="admin-topbar" id="ringkasan">
            <div className="admin-brand">
              <p className="eyebrow eyebrow-green">Panel panitia</p>
              <h1>{summary.title}</h1>
              <p>Ruang kerja untuk mengatur pemilihan, memantau kesiapan, dan menjaga jejak setiap perubahan.</p>
            </div>
            <div className="admin-session">
              <span className={`admin-status-pill admin-status-${summary.status}`}><CircleDot aria-hidden="true" size={14} /> Voting {summary.statusLabel.toLowerCase()}</span>
              <p>Masuk sebagai <strong>{admin.username}</strong></p>
              <form action={logoutAction}><button className="button button-outline admin-logout" type="submit"><LogOut aria-hidden="true" size={16} /> Keluar</button></form>
            </div>
          </header>

          <nav className="admin-local-nav" aria-label="Navigasi panel panitia">
            <a href="#ringkasan">Ringkasan</a>
            <a href="#operasi">Operasi</a>
            <a href="#peserta">Peserta</a>
            <a href="#kandidat">Kandidat</a>
            <a href="#monitoring">Monitoring</a>
            <a className="admin-nav-danger" href="#reset">Reset</a>
          </nav>

          {params.notice && <p className="form-notice admin-feedback" role="status"><CheckCircle2 aria-hidden="true" size={18} />{params.notice}</p>}
          {params.error && <p className="form-error admin-feedback" role="alert"><AlertTriangle aria-hidden="true" size={18} />{params.error}</p>}

          <section className="admin-command-grid" aria-label="Ringkasan operasional">
            <article className="admin-next-action">
              <div>
                <p className="eyebrow eyebrow-green">{nextAction.eyebrow}</p>
                <h2>{nextAction.title}</h2>
                <p>{nextAction.body}</p>
              </div>
              <a className="button" href={nextAction.href}>{nextAction.label}</a>
            </article>

            <aside className="admin-readiness" aria-labelledby="readiness-title">
              <div className="admin-panel-kicker"><ShieldCheck aria-hidden="true" size={18} /><span>Kesiapan event</span></div>
              <h2 id="readiness-title">{summary.statusLabel}</h2>
              <p>{statusMessage}</p>
              <ul>
                <li><span>Peserta eligible</span><strong>{summary.voterCount > 0 ? "Siap" : "Belum ada"}</strong></li>
                <li><span>Kandidat published</span><strong>{publishedCandidateCount}/2 minimum</strong></li>
                <li><span>Hasil publik</span><strong>{resultVisibilityLabel(summary.resultVisibility)}</strong></li>
              </ul>
            </aside>
          </section>

          <section className="admin-metric-strip" aria-label="Metrik pemilihan">
            <article><Settings2 aria-hidden="true" /><span>Status event</span><strong>{summary.statusLabel}</strong></article>
            <article><UsersRound aria-hidden="true" /><span>Peserta eligible</span><strong>{summary.voterCount}</strong></article>
            <article><Vote aria-hidden="true" /><span>Suara diterima</span><strong>{summary.voteCount}</strong></article>
            <article><Eye aria-hidden="true" /><span>Hasil publik</span><strong>{resultVisibilityLabel(summary.resultVisibility)}</strong></article>
          </section>

          <section className="admin-work-panel admin-operation-panel" id="operasi" aria-labelledby="event-control-title">
            <div className="admin-section-heading">
              <div><p className="eyebrow eyebrow-green">Operasi event</p><h2 id="event-control-title">Kontrol voting</h2></div>
              <span className={`admin-status-pill admin-status-${summary.status}`}>{summary.statusLabel}</span>
            </div>
            <div className="admin-operation-layout">
              <div className="admin-operation-main">
                <p className="admin-lead">{statusMessage}</p>
                <div className="admin-action-row">
                  <form action={eventStatusAction}><input type="hidden" name="status" value="open" /><button className="button" type="submit" disabled={summary.status === "open"}>Buka voting</button></form>
                  <form action={eventStatusAction}><input type="hidden" name="status" value="closed" /><button className="button button-outline" type="submit" disabled={summary.status === "closed"}>Tutup voting</button></form>
                </div>
                <p className="admin-hint">Saat tombol dibuka, server memeriksa daftar peserta, kandidat published, serta konfigurasi keamanan terakhir.</p>
              </div>
              <div className="admin-result-policy">
                <div><p className="admin-field-label">Keterlihatan hasil</p><p>Publik hanya menerima rekap agregat; identitas dan pilihan tiap pemilih tidak pernah ditampilkan.</p></div>
                <div className="admin-policy-options">
                  <form action={resultVisibilityAction}><input type="hidden" name="visibility" value="hidden" /><button className={`admin-policy-option${summary.resultVisibility === "hidden" ? " is-selected" : ""}`} type="submit" disabled={summary.resultVisibility === "hidden"}><strong>Sembunyikan</strong><span>Tidak ada hasil publik</span></button></form>
                  <form action={resultVisibilityAction}><input type="hidden" name="visibility" value="full_live" /><button className={`admin-policy-option${summary.resultVisibility === "full_live" ? " is-selected" : ""}`} type="submit" disabled={summary.resultVisibility === "full_live"}><strong>Tampilkan langsung</strong><span>Rekap diperbarui saat voting</span></button></form>
                  <form action={resultVisibilityAction}><input type="hidden" name="visibility" value="final_only" /><button className={`admin-policy-option${summary.resultVisibility === "final_only" ? " is-selected" : ""}`} type="submit" disabled={summary.resultVisibility === "final_only"}><strong>Setelah ditutup</strong><span>Rekap tampil saat event selesai</span></button></form>
                </div>
              </div>
            </div>
          </section>

          <div className="admin-work-grid">
            <section className="admin-work-panel" id="peserta" aria-labelledby="voters-title">
              <div className="admin-section-heading"><div><p className="eyebrow eyebrow-green">Persiapan peserta</p><h2 id="voters-title">Impor daftar eligible</h2></div><FileSpreadsheet aria-hidden="true" className="admin-section-icon" /></div>
              <p>Gunakan XLSX dengan header <code>NIM</code>, <code>NAMA</code>, dan <code>KELAS</code>. Import mengganti seluruh daftar dan terkunci saat voting dibuka.</p>
              <form className="admin-form admin-import-form" action={importVotersAction}>
                <label>Spreadsheet XLSX<input name="workbook" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required /></label>
                <button className="button" type="submit">Impor daftar peserta</button>
              </form>
            </section>

            <section className="admin-work-panel" id="kandidat" aria-labelledby="candidate-control-title">
              <div className="admin-section-heading"><div><p className="eyebrow eyebrow-green">Persiapan kandidat</p><h2 id="candidate-control-title">Status publikasi</h2></div><ClipboardList aria-hidden="true" className="admin-section-icon" /></div>
              <p>Profil, poster, visi, dan misi bersumber dari katalog proyek. Perubahan terkunci ketika voting aktif.</p>
              <form className="admin-sync-form" action={syncCandidatesAction}><button className="button button-outline button-compact" type="submit" disabled={summary.status === "open" || summary.voteCount > 0}>Sinkronkan materi calon</button></form>
              <ul className="admin-candidate-list">
                {allCandidates.map((candidate) => {
                  const result = resultsByCandidate.get(candidate.id ?? "");
                  return <li key={candidate.id}>
                    <div className="admin-candidate-copy"><span className="admin-ballot-number">{String(candidate.number).padStart(2, "0")}</span><div><strong>{candidate.name}</strong><span>{candidate.isPublished ? "Tampil publik" : "Disembunyikan"}{result ? ` · ${result.voteCount} suara` : ""}</span></div></div>
                    <form action={candidatePublishAction}><input type="hidden" name="candidateId" value={candidate.id} /><input type="hidden" name="published" value={candidate.isPublished ? "false" : "true"} /><button className="button button-compact button-outline" type="submit" disabled={summary.status === "open"}>{candidate.isPublished ? "Sembunyikan" : "Publikasikan"}</button></form>
                  </li>;
                })}
              </ul>
            </section>
          </div>

          <section className="admin-work-panel admin-voter-panel" id="monitoring" aria-labelledby="voter-list-title">
            <div className="admin-section-heading"><div><p className="eyebrow eyebrow-green">Monitoring peserta</p><h2 id="voter-list-title">Daftar peserta terimpor</h2></div><span className="admin-record-count">{voters.length} ditampilkan</span></div>
            <p>Hanya panitia yang dapat melihat daftar ini. Kolom pilihan calon tidak tersedia di sini.</p>
            <form className="admin-filter" method="get">
              <label>Cari NIM, nama, atau kelas<input name="q" defaultValue={params.q ?? ""} maxLength={80} /></label>
              <button className="button button-compact" type="submit">Cari</button>
              {params.q && <Link className="text-link" href="/panitia">Bersihkan</Link>}
            </form>
            {voters.length ? <>
              <div className="admin-table-wrap"><table className="admin-voter-table"><thead><tr><th>NIM</th><th>Nama</th><th>Kelas</th><th>TTD</th><th>Hak pilih</th><th>Status</th></tr></thead><tbody>{voters.map((voter) => <tr key={voter.nim}><td>{voter.nim}</td><td>{voter.name}</td><td>{voter.className}</td><td>{voter.attendanceMarked ? "Ada" : "—"}</td><td>{voter.isEligible ? "Eligible" : "Tidak"}</td><td>{voter.hasVoted ? "Sudah memilih" : "Belum memilih"}</td></tr>)}</tbody></table></div>
              <ul className="admin-voter-cards" aria-label="Daftar peserta versi ringkas">{voters.map((voter) => <li key={voter.nim}><div><strong>{voter.name}</strong><span>{voter.nim} · {voter.className}</span></div><div className="admin-voter-state"><span>{voter.isEligible ? "Eligible" : "Tidak eligible"}</span><span>{voter.hasVoted ? "Sudah memilih" : "Belum memilih"}</span></div></li>)}</ul>
            </> : <p className="admin-empty">Belum ada peserta yang diimpor atau pencarian tidak menemukan hasil.</p>}
          </section>

          <section className="admin-work-panel admin-audit-panel" aria-labelledby="audit-title">
            <div className="admin-section-heading"><div><p className="eyebrow eyebrow-green">Jejak operasional</p><h2 id="audit-title">Aktivitas terbaru</h2></div><ShieldCheck aria-hidden="true" className="admin-section-icon" /></div>
            {summary.recentAudit.length ? <ol className="audit-list">{summary.recentAudit.map((entry, index) => <li key={`${entry.createdAt}-${index}`}><span className="audit-marker" aria-hidden="true" /><div><strong>{entry.action}</strong><p>{entry.detail}</p></div><time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time></li>)}</ol> : <p className="admin-empty">Belum ada aktivitas yang tercatat untuk event ini.</p>}
          </section>

          <section className="admin-danger-zone" id="reset" aria-labelledby="reset-title">
            <details>
              <summary>
                <span className="admin-danger-icon"><RotateCcw aria-hidden="true" size={19} /></span>
                <span><span className="eyebrow eyebrow-red">Tindakan sensitif</span><strong id="reset-title">Reset voting dan peserta</strong><small>Terbuka hanya saat Anda siap melakukan reset.</small></span>
                <span className="admin-disclosure-label">Tinjau reset</span>
              </summary>
              <div className="admin-danger-content">
                <p>Urutan wajib: kosongkan suara voting terlebih dahulu, lalu reset daftar peserta. Calon, materi calon, akun admin, dan audit tidak dihapus.</p>
                <div className="admin-reset-grid">
                  <div className="admin-reset-step">
                    <span>Langkah 1</span><h3>Reset suara voting</h3>
                    <p>Mengosongkan suara, receipt, sesi voting, dan rate limit. Event kembali menjadi terjadwal.</p>
                    <form className="admin-form" action={resetVotesAction}><label>Alasan reset suara<textarea name="reason" required minLength={8} maxLength={160} /></label><label>Ketik <code>RESET SUARA VOTING</code><input name="confirmation" required /></label><button className="button button-danger" type="submit">Reset suara voting</button></form>
                  </div>
                  <div className="admin-reset-step" data-locked={!canResetVoters}>
                    <span>Langkah 2</span><h3>Reset peserta</h3>
                    <p>{summary.voteCount > 0 ? "Kosongkan suara voting terlebih dahulu." : summary.status !== "scheduled" ? "Kembalikan event ke status terjadwal terlebih dahulu." : "Suara sudah kosong. Daftar peserta dapat direset."}</p>
                    <form className="admin-form" action={resetVotersAction}><label>Alasan reset peserta<textarea name="reason" required minLength={8} maxLength={160} /></label><label>Ketik <code>RESET PESERTA</code><input name="confirmation" required /></label><button className="button button-danger" type="submit" disabled={!canResetVoters}>Reset peserta</button></form>
                  </div>
                </div>
              </div>
            </details>
          </section>
        </div>
      </main>
    </PageTransition>
  );
}
