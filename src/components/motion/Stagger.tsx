"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants, staggerContainerVariants, type RevealPreset } from "./variants";

type StaggerContainerProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  preset?: RevealPreset;
};

export function StaggerContainer({
  children,
  className,
  amount = 0.2,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={staggerContainerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  preset = "card",
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? undefined : revealVariants[preset]}
    >
      {children}
    </motion.div>
  );
}
