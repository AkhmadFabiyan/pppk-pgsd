import { BarChart3, CircleHelp, ShieldCheck } from "lucide-react";
import { CandidateShowcase } from "@/components/candidate-showcase";
import { FeatureHighlights } from "@/components/feature-highlights";
import { ForestHero } from "@/components/forest-hero";
import { PageTransition } from "@/components/page-transition";
import { LiveResultSummary } from "@/components/live-result-summary";
import { SectionReveal } from "@/components/section-reveal";
import { VotingJourney } from "@/components/voting-journey";
import { getElectionSnapshot } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const election = await getElectionSnapshot();
  const resultCandidates = election.candidates.map(({ id, number, name, className }) => ({ id, number, name, className }));
  return (
    <PageTransition>
      <ForestHero statusLabel={election.statusLabel} scheduleLabel={election.scheduleLabel} isOpen={election.status === "open"} />

      <section className="section section-soft" aria-labelledby="overview-heading">
        <SectionReveal className="container split-heading">
          <div>
            <p className="eyebrow eyebrow-green">Mulai dari sini</p>
            <h2 id="overview-heading">Siapkan pilihanmu.</h2>
          </div>
          <p>Kenali calon dan alur voting dalam satu tempat. Data pemilih dan pilihan suara tetap pribadi.</p>
        </SectionReveal>
        <FeatureHighlights />
      </section>

      <section className="section" id="kandidat" aria-labelledby="candidate-heading">
        <SectionReveal className="container section-heading">
          <div>
            <p className="eyebrow eyebrow-red">Ketua angkatan 2026</p>
            <h2 id="candidate-heading">Kenali setiap calon.</h2>
          </div>
          <p className="section-note">Cek nomor, nama, kelas, dan poster resmi. Kamu belum memilih di sini.</p>
        </SectionReveal>
        <div className="container">
          <CandidateShowcase candidates={election.candidates} />
        </div>
      </section>

      <section className="section process-section" id="panduan" aria-labelledby="process-heading">
        <SectionReveal className="container process-grid">
          <div>
            <p className="eyebrow eyebrow-green">Saat voting dibuka</p>
            <h2 id="process-heading">Empat langkah. Satu suara.</h2>
            <p>Saat voting dibuka, siapkan NIM dan pilih secara mandiri dari perangkatmu sendiri.</p>
            <p className="process-note">NIM, pilihan, dan kode bukti bersifat pribadi. Ada kendala? Hubungi panitia lewat kanal resmi.</p>
          </div>
          <VotingJourney />
        </SectionReveal>
      </section>

      <section className="section results-section" id="hasil" aria-labelledby="results-heading">
        <SectionReveal className="container results-panel">
          <BarChart3 aria-hidden="true" />
          <div>
            <p className="eyebrow eyebrow-green">Rekap pemilihan</p>
            <LiveResultSummary candidates={resultCandidates} initialResult={election.result} initialStatus={election.status} headingId="results-heading" />
          </div>
        </SectionReveal>
      </section>

      <section className="section section-callout" id="bantuan" aria-labelledby="support-heading">
        <SectionReveal className="container callout-content">
          <CircleHelp aria-hidden="true" />
          <div>
            <h2 id="support-heading">Butuh bantuan?</h2>
            <p>Gunakan kanal resmi panitia. Jangan kirim NIM, pilihan, atau kode bukti ke ruang publik.</p>
          </div>
          <a className="button" href="#panduan">Lihat caranya</a>
        </SectionReveal>
        <SectionReveal className="container privacy-strip" id="privasi" delay={0.08}><ShieldCheck aria-hidden="true" /><p><strong>Privasi:</strong> NIM, pilihan suara, data perangkat, dan audit tidak ditampilkan di halaman publik.</p></SectionReveal>
      </section>
    </PageTransition>
  );
}
