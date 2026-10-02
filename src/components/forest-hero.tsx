"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
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

  useEffect(() => {
    if (reduceMotion || !sceneRef.current) return;

    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void import("gsap").then(({ gsap }) => {
      if (cancelled || !sceneRef.current) return;

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline
          .from("[data-forest-layer='backdrop']", { autoAlpha: 0, y: 22, duration: 0.62 })
          .from("[data-forest-layer='kicker']", { autoAlpha: 0, y: 16, duration: 0.42 }, "-=0.4")
          .from("[data-forest-layer='title-line']", { autoAlpha: 0, y: 28, stagger: 0.1, duration: 0.54 }, "-=0.24")
          .from("[data-forest-layer='hero-detail']", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.42 }, "-=0.3")
          .from("[data-forest-layer='event-panel']", { autoAlpha: 0, x: 22, rotate: 1.5, duration: 0.56 }, "-=0.52");
      }, sceneRef);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [reduceMotion]);

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
      <div className="forest-backdrop" data-forest-layer="backdrop" aria-hidden="true">
        <div className="forest-glow" />
        <div className="forest-horizon forest-horizon-far" />
        <div className="forest-horizon forest-horizon-near" />
      </div>
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
        <div className="hero-copy forest-copy">
          <div data-forest-layer="kicker">
            <StatusBadge label={statusLabel} />
            <p className="eyebrow forest-eyebrow"><Sparkles aria-hidden="true" size={14} /> Pemilihan Ketua Angkatan · 2026</p>
          </div>
          <h1 className="forest-title" aria-label="PGSD 2026">
            <span data-forest-layer="title-line">PGSD</span>
            <span data-forest-layer="title-line">2026</span>
          </h1>
          <div data-forest-layer="hero-detail"><TypewriterPhrase /></div>
          <p className="hero-lead forest-lead" data-forest-layer="hero-detail">Kenali calon. Tentukan pilihan. Kirim satu suara untuk angkatan.</p>
          <div className="hero-actions" data-forest-layer="hero-detail">
            <Link className="button button-light forest-cta" href={isOpen ? "/vote" : "#kandidat"}>{isOpen ? "Mulai voting" : "Lihat calon"} <ArrowRight aria-hidden="true" size={18} /></Link>
            <Link className="forest-text-cta" href="#panduan">Cara voting <ArrowDownRight aria-hidden="true" size={18} /></Link>
          </div>
        </div>

        <motion.aside className="event-panel forest-event-panel" data-forest-layer="event-panel" whileHover={reduceMotion ? undefined : { y: -5, rotate: -0.6 }} transition={{ type: "spring", stiffness: 310, damping: 22 }} aria-label="Status voting">
          <div className="event-panel-topline"><span>Status voting</span><i aria-hidden="true" /></div>
          <p className="panel-label">Periode pemilihan</p>
          <strong>{statusLabel}</strong>
          <p>{scheduleLabel}</p>
          <div className="event-panel-rule" />
          <span>Gunakan NIM sendiri. Voting mengikuti jadwal panitia.</span>
          <div className="event-panel-stamp" aria-hidden="true">SATU NIM<br />SATU SUARA</div>
        </motion.aside>
      </div>
    </section>
  );
}
