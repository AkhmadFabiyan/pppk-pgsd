"use client";

import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import { formatBallotNumber, type Candidate } from "@/lib/site";

export function CandidateShowcase({ candidates }: { candidates: Candidate[] }) {
  const [selected, setSelected] = useState<Candidate | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  function selectCandidate(candidate: Candidate) {
    setSelected(candidate);
    window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" }), 0);
  }

  function moveCard(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--spot-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--spot-y", `${y * 100}%`);
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
  }

  function resetCard(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--spot-x", "50%");
    event.currentTarget.style.setProperty("--spot-y", "50%");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div className="candidate-showcase">
      <div className="candidate-grid">
        {candidates.map((candidate, index) => (
          <motion.article
            className="candidate-card"
            key={candidate.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : index * 0.045, ease: [0.16, 1, 0.3, 1] }}
            onPointerMove={moveCard}
            onPointerLeave={resetCard}
          >
            <div className="candidate-media">
              <Image src={candidate.poster} alt={`Poster ${candidate.name}`} width={4000} height={2250} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
              <span className="candidate-number">{formatBallotNumber(candidate.number)}</span>
            </div>
            <div className="candidate-content">
              <p>{candidate.className}</p>
              <h3>{candidate.name}</h3>
              <button className="candidate-detail-trigger" type="button" aria-expanded={selected?.slug === candidate.slug} onClick={() => selectCandidate(candidate)}>
                Buka visi dan misi <ChevronDown aria-hidden="true" size={17} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {selected && (
          <motion.div
            className="candidate-inline-detail"
            ref={detailRef}
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
          >
            <div className="candidate-inline-inner">
              <div className="candidate-inline-header">
                <p><span>{formatBallotNumber(selected.number)}</span>{selected.className}</p>
                <button className="icon-button" type="button" onClick={() => setSelected(null)} aria-label={`Tutup visi dan misi ${selected.name}`}><X aria-hidden="true" size={20} /></button>
              </div>
              <div className="candidate-inline-content">
                <div>
                  <h3>{selected.name}</h3>
                  <p className="candidate-inline-vision">{selected.vision}</p>
                </div>
                <div>
                  <h4>Misi</h4>
                  <ol>
                    {selected.missions.map((mission) => <li key={mission}>{mission}</li>)}
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
