"use client";

import { Check, ChevronRight, Fingerprint, Send, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const steps = [
  { icon: Fingerprint, title: "Verifikasi NIM", body: "Masukkan NIM-mu saat voting dibuka." },
  { icon: Sparkles, title: "Pilih calon", body: "Pilih satu calon." },
  { icon: Send, title: "Cek pilihan", body: "Pastikan pilihanmu sebelum mengirim." },
  { icon: Check, title: "Simpan kode bukti", body: "Simpan receipt setelah suara diterima." }
] as const;

export function VotingJourney() {
  const reduceMotion = useReducedMotion();

  return (
    <ol className="process-list voting-journey">
      {steps.map(({ icon: Icon, title, body }, index) => (
        <motion.li
          key={title}
          initial={reduceMotion ? false : { opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduceMotion ? undefined : { x: 8 }}
        >
          <span className="journey-index">0{index + 1}</span>
          <span className="journey-icon" aria-hidden="true"><Icon size={18} /></span>
          <div>
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
          {index < steps.length - 1 && <ChevronRight className="journey-arrow" aria-hidden="true" size={18} />}
        </motion.li>
      ))}
    </ol>
  );
}
