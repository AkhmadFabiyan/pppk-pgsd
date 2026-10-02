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
    <h2 id={headingId}>Hasil belum dipublikasikan.</h2>
    <p>Panitia akan membuka rekap sesuai kebijakan hasil. Tidak ada angka contoh atau simulasi.</p>
  </>;

  return <>
    <h2 id={headingId}>Rekap suara.</h2>
    <AnimatedResultSummary result={result} candidates={candidates} />
    <p className="results-live-status" aria-live="polite">{connection === "stale" ? "Pembaruan tertunda · menampilkan angka terakhir." : status === "open" ? "Memperbarui otomatis." : "Rekap final."}</p>
  </>;
}
