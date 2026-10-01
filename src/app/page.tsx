import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, CircleHelp, ShieldCheck, UsersRound } from "lucide-react";
import { CandidateShowcase } from "@/components/candidate-showcase";
import { PageTransition } from "@/components/page-transition";
import { StatusBadge } from "@/components/status-badge";
import { getElectionSnapshot } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const election = getElectionSnapshot();
  const resultsByCandidate = new Map(election.result?.candidates.map((item) => [item.candidateId, item]) ?? []);
  return (
    <PageTransition>
      <section className="hero">
        <div className="hero-contour" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <StatusBadge label={election.statusLabel} />
            <p className="eyebrow">Pemilihan Ketua Angkatan</p>
            <h1>PGSD <span>2026</span></h1>
            <p className="hero-lead">Ruang resmi untuk mengenal calon, memahami proses pemilihan, dan menggunakan suara saat periode voting dibuka.</p>
            <div className="hero-actions">
              <Link className="button button-light" href={election.status === "open" ? "/vote" : "#kandidat"}>{election.status === "open" ? "Gunakan suara" : "Lihat kandidat"} <ArrowRight aria-hidden="true" size={18} /></Link>
              <Link className="button button-ghost-light" href="#panduan">Panduan voting</Link>
            </div>
          </div>
          <aside className="event-panel" aria-label="Status pemilihan">
            <p className="panel-label">Status pemilihan</p>
            <strong>{election.statusLabel}</strong>
            <p>{election.scheduleLabel}</p>
            <div className="event-panel-rule" />
            <span>Verifikasi NIM dan voting akan aktif setelah periode resmi dibuka.</span>
          </aside>
        </div>
      </section>

      <section className="section section-soft" aria-labelledby="overview-heading">
        <div className="container split-heading">
          <div>
            <p className="eyebrow eyebrow-green">Informasi pemilihan</p>
            <h2 id="overview-heading">Satu ruang untuk seluruh proses.</h2>
          </div>
          <p>Website ini menyajikan informasi yang diperlukan pemilih tanpa memuat data peserta, pilihan pribadi, maupun angka hasil sebelum kebijakan publikasi mengizinkannya.</p>
        </div>
        <div className="container principle-grid">
          <article>
            <ShieldCheck aria-hidden="true" />
            <h3>Terjaga</h3>
            <p>Satu NIM hanya dapat menghasilkan satu suara final setelah verifikasi server tersedia.</p>
          </article>
          <article>
            <UsersRound aria-hidden="true" />
            <h3>Terbuka</h3>
            <p>Profil, visi, dan misi setiap calon tersedia untuk dibaca sebelum memilih.</p>
          </article>
          <article>
            <CheckCircle2 aria-hidden="true" />
            <h3>Terukur</h3>
            <p>Status event dan hasil agregat mengikuti kebijakan serta data resmi panitia.</p>
          </article>
        </div>
      </section>

      <section className="section" id="kandidat" aria-labelledby="candidate-heading">
        <div className="container section-heading">
          <div>
            <p className="eyebrow eyebrow-red">Calon ketua angkatan</p>
            <h2 id="candidate-heading">Kenali pilihanmu.</h2>
          </div>
          <p className="section-note">Pilih satu nama untuk membaca visi dan misi tanpa meninggalkan halaman ini.</p>
        </div>
        <div className="container">
          <CandidateShowcase candidates={election.candidates} />
        </div>
      </section>

      <section className="section process-section" id="panduan" aria-labelledby="process-heading">
        <div className="container process-grid">
          <div>
            <p className="eyebrow eyebrow-green">Cara menggunakan suara</p>
            <h2 id="process-heading">Jelas sejak awal.</h2>
            <p>Proses voting hanya berjalan saat event dibuka. Gunakan NIM milik sendiri dan simpan kode receipt setelah suara diterima.</p>
            <p className="process-note">Jangan bagikan NIM atau kode receipt kepada siapa pun. Saat ada kendala, hubungi panitia melalui kanal resmi.</p>
          </div>
          <ol className="process-list">
            <li><span>01</span><div><strong>Verifikasi</strong><p>Masukkan NIM pada periode yang ditetapkan.</p></div></li>
            <li><span>02</span><div><strong>Pilih</strong><p>Pelajari kandidat lalu pilih satu calon.</p></div></li>
            <li><span>03</span><div><strong>Konfirmasi</strong><p>Periksa kembali pilihan sebelum suara dikirim.</p></div></li>
            <li><span>04</span><div><strong>Simpan bukti</strong><p>Catat receipt sebagai bukti penerimaan suara.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section results-section" id="hasil" aria-labelledby="results-heading">
        <div className="container results-panel">
          <BarChart3 aria-hidden="true" />
          <div>
            <p className="eyebrow eyebrow-green">Rekap pemilihan</p>
            <h2 id="results-heading">{election.result ? "Rekap suara saat ini." : "Hasil belum dipublikasikan."}</h2>
            {election.result ? <div className="result-summary"><p><strong>{election.result.totalCast}</strong> suara diterima dari {election.result.totalEligible} pemilih eligible ({election.result.turnoutPercent}%).</p><ul>{election.candidates.map((candidate) => { const item = resultsByCandidate.get(candidate.id ?? ""); return <li key={candidate.id}><span>{String(candidate.number).padStart(2, "0")} · {candidate.name}</span><strong>{item?.voteCount ?? 0} suara · {item?.votePercent ?? 0}%</strong></li>; })}</ul><p className="results-updated">Diperbarui {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(election.result.updatedAt))}</p></div> : <p>Rekap hanya tampil ketika kebijakan hasil dan status event mengizinkannya. Tidak ada angka contoh atau simulasi.</p>}
          </div>
        </div>
      </section>

      <section className="section section-callout" id="bantuan" aria-labelledby="support-heading">
        <div className="container callout-content">
          <CircleHelp aria-hidden="true" />
          <div>
            <h2 id="support-heading">Butuh bantuan sebelum voting dibuka?</h2>
            <p>Jadwal dan kanal bantuan resmi akan diumumkan panitia. Jangan mengirim NIM, pilihan calon, atau receipt ke kanal publik.</p>
          </div>
          <a className="button" href="#panduan">Baca panduan</a>
        </div>
        <div className="container privacy-strip" id="privasi"><ShieldCheck aria-hidden="true" /><p><strong>Privasi:</strong> NIM, pilihan suara, sinyal perangkat, dan data audit tidak dipublikasikan pada website ini.</p></div>
      </section>
    </PageTransition>
  );
}
