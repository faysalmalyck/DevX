"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/motion";

type HomeSectionMotionProps = {
  children: ReactNode;
  className?: string;
};

export default function HomeSectionMotion({
  children,
  className,
}: HomeSectionMotionProps) {
  return (
    <ScrollReveal className={className} preset="copy">
      {children}
    </ScrollReveal>
  );
}
