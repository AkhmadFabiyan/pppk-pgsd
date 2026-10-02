"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { formatBallotNumber, type Candidate } from "@/lib/site";

export function CandidateShowcase({ candidates }: { candidates: Candidate[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="candidate-showcase">
      <div className="candidate-grid">
        {candidates.map((candidate, index) => (
          <motion.article
            className="candidate-card"
            key={candidate.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.36, delay: reduceMotion ? 0 : (index % 3) * 0.065, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduceMotion ? undefined : { y: -6 }}
          >
            <div className="candidate-media">
              <Image src={candidate.poster} alt={`Poster ${candidate.name}`} width={4000} height={2250} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
              <span className="candidate-number">{formatBallotNumber(candidate.number)}</span>
            </div>
            <div className="candidate-content">
              <p>{candidate.className}</p>
              <h3>{candidate.name}</h3>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
