"use client";

import { motion } from "motion/react";

import { useCases } from "@/features/landing/components/landing-content";
import { revealItemVariants } from "@/features/landing/components/landing-motion";
import { Reveal } from "@/features/landing/components/scroll-reveal";

export const UseCasesSection = ({ reduceMotion }: { reduceMotion: boolean }) => {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal reduceMotion={reduceMotion} amount={0.3} className="mb-16">
          <motion.p
            variants={revealItemVariants}
            className="text-sm font-medium text-primary mb-3"
          >
            Who it&apos;s for
          </motion.p>
          <motion.h2
            variants={revealItemVariants}
            className="text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight leading-[1.05] max-w-2xl"
          >
            Built for builders
            <br />
            who ship.
          </motion.h2>
        </Reveal>

        <div className="space-y-0">
          {useCases.map((useCase, index) => (
            <Reveal
              key={useCase.title}
              reduceMotion={reduceMotion}
              amount={0.2}
              margin="0px 0px -60px 0px"
            >
              <motion.div
                variants={revealItemVariants}
                whileHover={reduceMotion ? undefined : { x: 10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group grid md:grid-cols-[80px_1fr_40px] gap-6 items-center border-t border-border/35 py-8 cursor-default"
              >
                <span className="text-4xl md:text-5xl font-semibold text-border/25 font-mono select-none tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div
                    className="mb-2 inline-flex p-1.5 rounded-lg"
                    style={{
                      background:
                        "color-mix(in oklch, var(--primary) 10%, transparent)",
                    }}
                  >
                    <useCase.icon className="size-3.5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-lg leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex justify-end">
                  <div
                    className="size-8 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "color-mix(in oklch, var(--primary) 14%, transparent)",
                    }}
                  >
                    <svg
                      className="size-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
          <div className="border-t border-border/35" />
        </div>
      </div>
    </section>
  );
};
