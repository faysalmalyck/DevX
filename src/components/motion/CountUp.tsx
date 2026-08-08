"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motionEase } from "./variants";

type CountUpProps = {
  value: number;
  className?: string;
};

export default function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    if (shouldReduceMotion) {
      setCount(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 0.85,
      ease: motionEase,
      onUpdate: (latest) => setCount(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, shouldReduceMotion, value]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={
        shouldReduceMotion || !isInView
          ? undefined
          : { opacity: 1, y: 0, transition: { duration: 0.65, ease: motionEase } }
      }
    >
      {count}
    </motion.span>
  );
}
