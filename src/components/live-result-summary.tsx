"use client";

import type { PublicResult } from "@/lib/db";
import type { CandidateSummary, ElectionStatus } from "@/lib/site";
import { AnimatedResultSummary } from "@/components/animated-result-summary";
import { usePublicResults } from "@/components/use-public-results";

export function LiveResultSummary({
  candidates,
  initialResult,
  initialStatus,
  headingId
}: {
  candidates: CandidateSummary[];
  initialResult: PublicResult | null;
  initialStatus: ElectionStatus;
  headingId: string;
}) {
  const { result, status, connection } = usePublicResults(initialResult, initialStatus);

  if (!result) return <>
    <h2 id={headingId}>Hasil belum bisa ditampilkan.</h2>
    <p>Panitia akan membuka rekap sesuai kebijakan hasil dan status pemilihan. Tidak ada angka contoh atau simulasi.</p>
  </>;

  return <>
    <h2 id={headingId}>Suara yang sudah masuk.</h2>
    <AnimatedResultSummary result={result} candidates={candidates} />
    <p className="results-live-status" aria-live="polite">{connection === "stale" ? "Pembaruan otomatis tertunda. Menampilkan angka terakhir." : status === "open" ? "Memperbarui otomatis setiap beberapa detik." : "Rekap hasil final."}</p>
  </>;
}
