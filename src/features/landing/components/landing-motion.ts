import type { Variants } from "motion/react";

export const revealSectionVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.13,
    },
  },
};

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const clipUpVariants: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", y: 16 },
  show: {
    clipPath: "inset(0% 0 0 0)",
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -56 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 56 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Returns motion props for scroll-triggered reveal animations.
 * `margin` shrinks the intersection viewport from the bottom so elements
 * only animate once they've clearly entered the visible area — not when they're
 * barely peeking in from below the fold.
 */
export const getRevealProps = (reduceMotion: boolean, amount = 0.2) => {
  if (reduceMotion) {
    return {
      initial: "show" as const,
      animate: "show" as const,
    };
  }

  return {
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: {
      once: true,
      amount,
      margin: "0px 0px -80px 0px",
    },
  };
};
