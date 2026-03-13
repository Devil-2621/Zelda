"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { HTMLMotionProps, Variants } from "motion/react";

import {
  revealSectionVariants,
} from "@/features/landing/components/landing-motion";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /**
   * Fraction of element visible before triggering (0–1).
   * Lower = fires earlier as element enters viewport.
   */
  amount?: number;
  /**
   * Extra bottom margin (negative = offset trigger point upward so element
   * must be clearly on-screen before animating).
   */
  margin?: string;
  reduceMotion?: boolean;
  variants?: Variants;
}

/**
 * Wraps children in a scroll-triggered reveal animation.
 * Uses `useInView` + `animate` instead of `whileInView` so it works
 * correctly in Next.js App Router without hydration mismatches.
 */
export const Reveal = ({
  children,
  className,
  style,
  amount = 0.15,
  margin = "0px 0px -80px 0px",
  reduceMotion = false,
  variants = revealSectionVariants,
  ...rest
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    // Cast margin — motion/react v12 accepts CSS margin strings
    margin: margin as Parameters<typeof useInView>[1] extends { margin?: infer M } ? M : never,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={reduceMotion || isInView ? "show" : "hidden"}
      variants={variants}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
