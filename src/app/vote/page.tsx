import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleUserRound, ShieldCheck, Vote } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { StatusBadge } from "@/components/status-badge";
import { VotingWizard } from "@/components/voting-wizard";
import { getElectionSnapshot } from "@/lib/db";

export const metadata: Metadata = { title: "Gunakan Suara", robots: { index: false, follow: false } };

const steps = [
  {
    number: "01",
    title: "Verifikasi NIM",
    description: "Masukkan NIM milik sendiri. Server memeriksa hak pilih dan status suara secara aman.",
    icon: ShieldCheck
  },
  {
    number: "02",
    title: "Pilih calon",
    description: "Pilih satu calon pada surat suara berdasarkan nomor, nama, dan kelas.",
    icon: CircleUserRound
  },
  {
    number: "03",
    title: "Konfirmasi & kirim",
    description: "Periksa pilihan sekali lagi, lalu kirim suara. Receipt dibuat otomatis bila server menerima suara.",
    icon: Vote
  }
];

export const dynamic = "force-dynamic";

export default async function VotePage() {
  const election = await getElectionSnapshot();
  const ballotCandidates = election.candidates.map(({ id, number, name, className }) => ({ id, number, name, className }));
  return (
    <PageTransition>
      <section className="vote-page">
        <div className="container vote-shell">
          <Link className="text-link vote-back" href="/"><ArrowLeft aria-hidden="true" size={17} /> Kembali ke beranda</Link>
          <header className="vote-header">
            <StatusBadge label={election.statusLabel} />
            <p className="eyebrow eyebrow-green">Ruang voting</p>
            <h1>Satu proses. Tiga tahap.</h1>
            <p>Voting hanya dapat dimulai saat panitia membuka event. Tidak ada data atau suara yang dikirim sebelum itu.</p>
          </header>
          {election.status === "open" ? <VotingWizard candidates={ballotCandidates} /> : <><ol className="vote-steps">
              {steps.map((step) => {
                const Icon = step.icon;
                return <li key={step.number}><span className="vote-step-number">{step.number}</span><Icon aria-hidden="true" /><h2>{step.title}</h2><p>{step.description}</p></li>;
              })}
            </ol>
            <div className="vote-closed-notice">
              <CheckCircle2 aria-hidden="true" />
              <div><strong>{election.statusLabel}</strong><p>{election.scheduleLabel} Halaman ini akan menampilkan tahap pertama setelah voting resmi dibuka.</p></div>
            </div></>}
        </div>
      </section>
    </PageTransition>
  );
}
