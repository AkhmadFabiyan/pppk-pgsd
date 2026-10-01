"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function SectionReveal({ children, className, delay = 0, id }: { children: ReactNode; className?: string; delay?: number; id?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.68, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
