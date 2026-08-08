"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants, type RevealPreset } from "./variants";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  preset?: RevealPreset;
  amount?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  preset = "copy",
  amount = 0.2,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={revealVariants[preset]}
      custom={delay}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
