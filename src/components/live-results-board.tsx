"use client";

import { Wifi, WifiOff } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Candidate, ElectionStatus } from "@/lib/site";
import type { PublicResult } from "@/lib/db";
import { formatBallotNumber } from "@/lib/site";

type ConnectionState = "connected" | "stale";

type ResultsApiPayload = {
  data?: {
    status?: ElectionStatus;
    visible?: boolean;
    result?: PublicResult;
  };
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short"
  }).format(new Date(value));
}

function isVisibleResult(payload: ResultsApiPayload): payload is { data: { status: ElectionStatus; visible: true; result: PublicResult } } {
  return payload.data?.visible === true && Boolean(payload.data.result) && Boolean(payload.data.status);
}

export function LiveResultsBoard({
  candidates,
  initialResult,
  initialStatus
}: {
  candidates: Candidate[];
  initialResult: PublicResult | null;
  initialStatus: ElectionStatus;
}) {
  const reduceMotion = useReducedMotion();
  const [result, setResult] = useState(initialResult);
  const [status, setStatus] = useState(initialStatus);
  const [connection, setConnection] = useState<ConnectionState>("connected");
  const [changedCandidateIds, setChangedCandidateIds] = useState<Set<string>>(() => new Set());
  const clearChangeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestResult = useRef<PublicResult | null>(initialResult);

  useEffect(() => {
    if (!initialResult || initialStatus !== "open") return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let retryDelay = 10_000;

    const schedule = (delay: number) => {
      timer = setTimeout(refresh, delay);
    };

    const refresh = async () => {
      try {
        const response = await fetch("/api/results", { cache: "no-store" });
        const payload = await response.json() as ResultsApiPayload;
        if (cancelled) return;

        if (!isVisibleResult(payload)) {
          latestResult.current = null;
          setResult(null);
          setStatus(payload.data?.status ?? "scheduled");
          setConnection("connected");
          return;
        }

        const previousCounts = new Map(latestResult.current?.candidates.map((item) => [item.candidateId, item.voteCount]));
        const changed = payload.data.result.candidates
          .filter((item) => previousCounts.get(item.candidateId) !== item.voteCount)
          .map((item) => item.candidateId);
        if (changed.length > 0 && !reduceMotion) {
          setChangedCandidateIds(new Set(changed));
          if (clearChangeTimer.current) clearTimeout(clearChangeTimer.current);
          clearChangeTimer.current = setTimeout(() => setChangedCandidateIds(new Set()), 320);
        }
        latestResult.current = payload.data.result;
        setResult(payload.data.result);
        setStatus(payload.data.status);
        setConnection("connected");
        retryDelay = 10_000;
        if (payload.data.status === "open") schedule(retryDelay);
      } catch {
        if (cancelled) return;
        setConnection("stale");
        retryDelay = Math.min(retryDelay * 2, 60_000);
        schedule(retryDelay);
      }
    };

    schedule(retryDelay);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (clearChangeTimer.current) clearTimeout(clearChangeTimer.current);
    };
  }, [initialResult, initialStatus, reduceMotion]);

  if (!result) {
    return (
      <section className="live-results-page live-results-unavailable" aria-labelledby="live-results-heading">
        <div className="live-unavailable-card">
          <p className="live-kicker">PGSD 2026</p>
          <h1 id="live-results-heading">Hasil belum dipublikasikan.</h1>
          <p>Panitia akan menampilkan rekap resmi setelah kebijakan hasil mengizinkannya.</p>
        </div>
      </section>
    );
  }

  const resultByCandidate = new Map(result.candidates.map((item) => [item.candidateId, item]));
  const isLive = status === "open";

  return (
    <section className="live-results-page" aria-labelledby="live-results-heading">
      <header className="live-results-header">
        <div>
          <p className="live-kicker">PGSD 2026 · Pemilihan ketua angkatan</p>
          <h1 id="live-results-heading">{isLive ? "Hasil live" : "Hasil akhir"}</h1>
        </div>
        <div className="live-summary" aria-label="Ringkasan hasil">
          <strong>{formatNumber(result.totalCast)}</strong>
          <span>suara · {result.turnoutPercent}% partisipasi</span>
          <p className={`live-connection live-connection-${connection}`}>
            {connection === "stale" ? <WifiOff aria-hidden="true" size={15} /> : <Wifi aria-hidden="true" size={15} />}
            {connection === "stale" ? "Pembaruan tertunda" : isLive ? "Memperbarui otomatis" : "Rekap final"}
          </p>
        </div>
      </header>

      <div className="live-candidate-grid" aria-label="Jumlah suara setiap calon">
        {candidates.map((candidate) => {
          const item = resultByCandidate.get(candidate.id ?? "");
          const changed = changedCandidateIds.has(candidate.id ?? "");
          return (
            <article className="live-candidate-tile" key={candidate.id ?? candidate.slug} aria-label={`${formatBallotNumber(candidate.number)} ${candidate.name}: ${item?.voteCount ?? 0} suara, ${item?.votePercent ?? 0} persen`}>
              <div className="live-candidate-title">
                <span>{formatBallotNumber(candidate.number)}</span>
                <h2>{candidate.name}</h2>
                <p>{candidate.className}</p>
              </div>
              <div className="live-candidate-count">
                <motion.strong animate={changed ? { scale: [1, 1.12, 1], color: ["#f7f6f1", "#dfff72", "#f7f6f1"] } : { scale: 1, color: "#f7f6f1" }} transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}>
                  {formatNumber(item?.voteCount ?? 0)}
                </motion.strong>
                <span>suara · {item?.votePercent ?? 0}%</span>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="live-results-footer">
        <span>{connection === "stale" ? "Menampilkan snapshot terakhir" : `Diperbarui ${formatUpdatedAt(result.updatedAt)}`}</span>
        <span>{result.totalEligible} pemilih eligible</span>
      </footer>
      <p className="sr-only" aria-live="polite">{connection === "stale" ? "Pembaruan hasil tertunda." : `Rekap terbaru: ${result.totalCast} suara.`}</p>
    </section>
  );
}
