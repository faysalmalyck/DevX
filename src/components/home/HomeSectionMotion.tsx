"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type HomeSectionMotionProps = {
  children: ReactNode;
  className?: string;
};

export default function HomeSectionMotion({
  children,
  className,
}: HomeSectionMotionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
