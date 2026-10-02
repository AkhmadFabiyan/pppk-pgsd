"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { StatusBadge } from "@/components/status-badge";
import { TypewriterPhrase } from "@/components/typewriter-phrase";

type ForestHeroProps = {
  statusLabel: string;
  scheduleLabel: string;
  isOpen: boolean;
};

const leaves = Array.from({ length: 7 }, (_, index) => index);

export function ForestHero({ statusLabel, scheduleLabel, isOpen }: ForestHeroProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const backdropY = useTransform(scrollY, [0, 760], [0, reduceMotion ? 0 : 110]);
  const foregroundY = useTransform(scrollY, [0, 760], [0, reduceMotion ? 0 : -55]);
  const springBackdropY = useSpring(backdropY, { stiffness: 110, damping: 28 });
  const springForegroundY = useSpring(foregroundY, { stiffness: 110, damping: 28 });

  function updatePointer(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--pointer-x", `${x}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${y}%`);
  }

  return (
    <section className="hero forest-hero" ref={sceneRef} onPointerMove={updatePointer}>
      <motion.div className="forest-backdrop" style={{ y: springBackdropY }} aria-hidden="true">
        <div className="forest-glow" />
        <div className="forest-horizon forest-horizon-far" />
        <div className="forest-horizon forest-horizon-near" />
      </motion.div>
      <div className="forest-leaves" aria-hidden="true">{leaves.map((leaf) => {
        const style = {
          "--leaf-size": `${7 + (leaf % 4) * 3}px`,
          "--leaf-top": `${-8 - leaf * 4}%`,
          "--leaf-left": `${4 + leaf * 8}%`,
          "--leaf-opacity": `${0.18 + leaf * 0.025}`,
          "--leaf-rotate": `${leaf * 29}deg`,
          "--leaf-drift": `${(leaf - 6) * 18}px`,
          "--leaf-duration": `${9 + leaf * 0.65}s`,
          "--leaf-delay": `${leaf * -0.75}s`
        } as CSSProperties;
        return <i key={leaf} style={style} />;
      })}</div>
      <div className="container hero-grid forest-hero-grid">
        <motion.div className="hero-copy forest-copy" style={{ y: springForegroundY }}>
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
            <StatusBadge label={statusLabel} />
            <p className="eyebrow forest-eyebrow"><Sparkles aria-hidden="true" size={14} /> Pemilihan Ketua Angkatan · 2026</p>
          </motion.div>
          <h1 className="forest-title" aria-label="PGSD 2026">
            <motion.span initial={reduceMotion ? false : { y: "120%" }} animate={{ y: 0 }} transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>PGSD</motion.span>
            <motion.span initial={reduceMotion ? false : { y: "120%" }} animate={{ y: 0 }} transition={{ duration: 0.75, delay: 0.17, ease: [0.16, 1, 0.3, 1] }}>2026</motion.span>
          </h1>
          <TypewriterPhrase />
          <motion.p className="hero-lead forest-lead" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}>Kenali seluruh calon, pertimbangkan pilihanmu, lalu gunakan satu suara untuk arah angkatan.</motion.p>
          <motion.div className="hero-actions" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.36, ease: "easeOut" }}>
            <Link className="button button-light forest-cta" href={isOpen ? "/vote" : "#kandidat"}>{isOpen ? "Masuk ke bilik suara" : "Lihat semua calon"} <ArrowRight aria-hidden="true" size={18} /></Link>
            <Link className="forest-text-cta" href="#panduan">Lihat cara memilih <ArrowDownRight aria-hidden="true" size={18} /></Link>
          </motion.div>
        </motion.div>

        <motion.aside className="event-panel forest-event-panel" initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 26 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }} whileHover={reduceMotion ? undefined : { y: -6, rotate: -1 }} aria-label="Status pemilihan">
          <div className="event-panel-topline"><span>Status saat ini</span><i aria-hidden="true" /></div>
          <p className="panel-label">Periode pemilihan</p>
          <strong>{statusLabel}</strong>
          <p>{scheduleLabel}</p>
          <div className="event-panel-rule" />
          <span>Gunakan NIM sendiri. Voting hanya tersedia pada jadwal resmi.</span>
          <div className="event-panel-stamp" aria-hidden="true">SATU NIM<br />SATU SUARA</div>
        </motion.aside>
      </div>
    </section>
  );
}
