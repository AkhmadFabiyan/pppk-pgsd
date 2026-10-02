"use client";

import { CheckCircle2, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const features = [
  { icon: ShieldCheck, title: "Suara terjaga", body: "Server menerima satu suara final dari setiap NIM yang berhasil diverifikasi.", accent: "leaf" },
  { icon: UsersRound, title: "Kenali calon", body: "Periksa nomor, nama, kelas, dan poster resmi setiap calon sebelum menentukan pilihan.", accent: "sun" },
  { icon: CheckCircle2, title: "Informasi resmi", body: "Status pemilihan dan rekap selalu mengikuti data yang disetujui panitia.", accent: "brick" }
] as const;

export function FeatureHighlights() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="container principle-grid feature-highlights">
      {features.map(({ icon: Icon, title, body, accent }, index) => (
        <motion.article
          className="feature-card"
          data-accent={accent}
          key={title}
          initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: index === 1 ? 0 : index === 0 ? -1.5 : 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduceMotion ? undefined : { y: -9, rotate: index === 1 ? 0 : index === 0 ? -0.7 : 0.7 }}
          whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        >
          <span className="feature-card-orbit" aria-hidden="true"><Sparkles size={15} /></span>
          <Icon aria-hidden="true" />
          <p className="feature-card-number">0{index + 1}</p>
          <h3>{title}</h3>
          <p>{body}</p>
        </motion.article>
      ))}
    </div>
  );
}
