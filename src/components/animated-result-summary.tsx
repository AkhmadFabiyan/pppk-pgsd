"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { CandidateSummary } from "@/lib/site";

type PublicResult = {
  totalEligible: number;
  totalCast: number;
  turnoutPercent: number;
  candidates: Array<{ candidateId: string; voteCount: number; votePercent: number }>;
  updatedAt: string;
};

function AnimatedNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const [number, setNumber] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    if (reduceMotion) {
      previousValue.current = value;
      return;
    }

    const startValue = previousValue.current;
    previousValue.current = value;
    if (startValue === value) return;
    const start = performance.now();
    const duration = 620;
    let frameId = 0;
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 4;
      setNumber(Math.round(startValue + (value - startValue) * eased));
      if (progress < 1) frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [reduceMotion, value]);

  return <span>{(reduceMotion ? value : number).toLocaleString("id-ID")}</span>;
}

export function AnimatedResultSummary({ result, candidates }: { result: PublicResult; candidates: CandidateSummary[] }) {
  const reduceMotion = useReducedMotion();
  const resultsByCandidate = new Map(result.candidates.map((item) => [item.candidateId, item]));
  const updatedAt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(result.updatedAt));

  return (
    <div className="result-summary result-summary-animated">
      <p className="result-total"><strong><AnimatedNumber value={result.totalCast} /></strong> suara sah tercatat dari {result.totalEligible.toLocaleString("id-ID")} pemilih yang berhak ({result.turnoutPercent}%).</p>
      <ul>
        {candidates.map((candidate, index) => {
          const item = resultsByCandidate.get(candidate.id ?? "");
          const voteCount = item?.voteCount ?? 0;
          const votePercent = item?.votePercent ?? 0;
          return (
            <motion.li
              key={candidate.id}
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : index * 0.045, ease: "easeOut" }}
            >
              <span>{String(candidate.number).padStart(2, "0")} · {candidate.name}</span>
              <strong><AnimatedNumber value={voteCount} /> suara · {votePercent}%</strong>
              <i aria-hidden="true" style={{ "--result-scale": votePercent / 100 } as CSSProperties} />
            </motion.li>
          );
        })}
      </ul>
      <p className="results-updated">Diperbarui {updatedAt}</p>
    </div>
  );
}
