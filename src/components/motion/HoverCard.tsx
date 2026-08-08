"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cardHoverTransition } from "./variants";

type HoverCardProps = {
  children: ReactNode;
  className?: string;
};

export default function HoverCard({ children, className }: HoverCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.015,
              boxShadow: "0 16px 36px rgba(59, 130, 246, 0.18)",
            }
      }
      transition={cardHoverTransition}
    >
      {children}
    </motion.div>
  );
}
