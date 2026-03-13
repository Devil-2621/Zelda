"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";

import { workflowSteps } from "@/features/landing/components/landing-content";
import { revealItemVariants } from "@/features/landing/components/landing-motion";
import { Reveal } from "@/features/landing/components/scroll-reveal";

export const HowItWorksSection = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 0.75", "end 0.4"],
  });

  return (
    <section
      id="workflow"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background:
          "color-mix(in oklch, var(--card) 40%, var(--background))",
      }}
    >
      {/* Subtle top/bottom gradients to blend into adjacent sections */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal reduceMotion={reduceMotion} amount={0.3} className="mb-16">
          <motion.p
            variants={revealItemVariants}
            className="text-sm font-medium text-primary mb-3"
          >
            Workflow
          </motion.p>
          <motion.h2
            variants={revealItemVariants}
            className="text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight leading-[1.05] max-w-2xl"
          >
            From idea to shipped.
            <br />A practical loop.
          </motion.h2>
        </Reveal>

        {/* Desktop: horizontal steps with scroll-driven line */}
        <div className="hidden md:block" ref={lineRef}>
          <div className="relative mb-12">
            {/* Track line */}
            <div className="absolute top-[18px] left-[18px] right-[18px] h-px bg-border/35" />
            {/* Animated progress */}
            {!reduceMotion && (
              <motion.div
                className="absolute top-[18px] left-[18px] h-px origin-left"
                style={{
                  scaleX: scrollYProgress,
                  right: "18px",
                  background: "var(--primary)",
                  opacity: 0.7,
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <Reveal
                key={step.title}
                reduceMotion={reduceMotion}
                amount={0.25}
                margin="0px 0px -40px 0px"
              >
                <motion.div variants={revealItemVariants}>
                  <div
                    className="mb-6 inline-flex size-9 items-center justify-center rounded-full border-2 bg-background relative z-10"
                    style={{
                      borderColor:
                        "color-mix(in oklch, var(--primary) 45%, var(--border))",
                    }}
                  >
                    <span className="text-[11px] font-mono font-medium text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <step.icon className="size-4 text-primary/60 mb-3" />
                  <h3 className="text-base font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-0">
          {workflowSteps.map((step, index) => (
            <Reveal
              key={step.title}
              reduceMotion={reduceMotion}
              amount={0.2}
              margin="0px 0px -40px 0px"
              className="flex gap-5 pb-10 last:pb-0"
            >
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="flex size-9 items-center justify-center rounded-full border-2 bg-background z-10 shrink-0"
                  style={{
                    borderColor:
                      "color-mix(in oklch, var(--primary) 45%, var(--border))",
                  }}
                >
                  <span className="text-[11px] font-mono font-medium text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="w-px flex-1 bg-border/35 mt-2" />
                )}
              </div>
              <motion.div
                variants={revealItemVariants}
                className="pt-1.5 pb-2"
              >
                <step.icon className="size-4 text-primary/60 mb-2" />
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
