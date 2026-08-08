import type { Transition, Variants } from "framer-motion";

export type RevealPreset =
  | "hero"
  | "heading"
  | "copy"
  | "card"
  | "image"
  | "left"
  | "right";

export const motionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const transition = (duration: number, delay = 0): Transition => ({
  duration,
  delay,
  ease: motionEase,
});

export const revealVariants: Record<RevealPreset, Variants> = {
  hero: {
    hidden: { opacity: 0, y: 32, scale: 0.98, filter: "blur(12px)" },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: transition(0.8, delay),
    }),
  },
  heading: {
    hidden: { opacity: 0, y: 28, scale: 0.985, filter: "blur(10px)" },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: transition(0.7, delay),
    }),
  },
  copy: {
    hidden: { opacity: 0, y: 22 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: transition(0.6, delay),
    }),
  },
  card: {
    hidden: { opacity: 0, y: 28, scale: 0.95 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: transition(0.65, delay),
    }),
  },
  image: {
    hidden: { opacity: 0, scale: 1.08 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      transition: transition(0.8, delay),
    }),
  },
  left: {
    hidden: { opacity: 0, x: -32 },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: transition(0.7, delay),
    }),
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: transition(0.7, delay),
    }),
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.12,
    },
  },
};

export const cardHoverTransition: Transition = {
  duration: 0.28,
  ease: motionEase,
};
