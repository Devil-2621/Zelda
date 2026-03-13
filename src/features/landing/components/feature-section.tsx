"use client";

import { motion } from "motion/react";

import { bentoFeatures } from "@/features/landing/components/landing-content";
import {
  revealItemVariants,
} from "@/features/landing/components/landing-motion";
import { Reveal } from "@/features/landing/components/scroll-reveal";

export const FeatureSection = ({ reduceMotion }: { reduceMotion: boolean }) => {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Section header */}
        <Reveal reduceMotion={reduceMotion} amount={0.3} className="mb-20">
          <motion.p
            variants={revealItemVariants}
            className="text-sm font-medium text-primary mb-3"
          >
            Capabilities
          </motion.p>
          <motion.h2
            variants={revealItemVariants}
            className="text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight leading-[1.05] max-w-2xl"
          >
            One workspace.
            <br />
            Everything you need.
          </motion.h2>
        </Reveal>

        {/* Feature list — each row independently scroll-triggered */}
        <div className="space-y-0">
          {bentoFeatures.map((feature, index) => (
            <Reveal
              key={feature.key}
              reduceMotion={reduceMotion}
              amount={0.15}
              margin="0px 0px -60px 0px"
            >
              <div className="grid gap-8 border-t border-border/35 py-10 md:grid-cols-[200px_1fr] md:py-14 md:gap-16 items-start">
                {/* Left: number + icon + eyebrow */}
                <motion.div
                  variants={revealItemVariants}
                  className="flex items-start gap-4"
                >
                  <span className="text-sm font-mono text-muted-foreground/35 mt-1 w-7 shrink-0 select-none tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div
                      className="mb-3 inline-flex p-2.5 rounded-xl"
                      style={{
                        background:
                          "color-mix(in oklch, var(--primary) 12%, transparent)",
                      }}
                    >
                      <feature.icon className="size-4 text-primary" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/55 font-medium">
                      {feature.eyebrow}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold tracking-tight leading-snug">
                      {feature.title}
                    </h3>
                  </div>
                </motion.div>

                {/* Right: description + highlights */}
                <motion.div variants={revealItemVariants}>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-card/40 text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  {feature.metric && (
                    <p className="mt-4 text-xs font-mono text-primary/60">
                      ↳ {feature.metric}
                    </p>
                  )}
                </motion.div>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-border/35" />
        </div>
      </div>
    </section>
  );
};
