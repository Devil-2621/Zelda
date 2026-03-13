"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon } from "lucide-react";

import { showcaseTabs } from "@/features/landing/components/landing-content";
import { revealItemVariants } from "@/features/landing/components/landing-motion";
import { Reveal } from "@/features/landing/components/scroll-reveal";

export const ShowcaseSection = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const [active, setActive] =
    useState<(typeof showcaseTabs)[number]["key"]>("create");
  const activeTab = showcaseTabs.find((t) => t.key === active) ?? showcaseTabs[0];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Section background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 65%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal reduceMotion={reduceMotion} amount={0.2} className="mb-12">
          <motion.p
            variants={revealItemVariants}
            className="text-sm font-medium text-primary mb-3"
          >
            Workflow preview
          </motion.p>
          <motion.h2
            variants={revealItemVariants}
            className="text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight leading-[1.05] max-w-2xl"
          >
            Create, iterate, deliver.
            <br />
            No context switching.
          </motion.h2>
        </Reveal>

        <Reveal reduceMotion={reduceMotion} amount={0.15} margin="0px 0px -60px 0px">
          {/* Tab buttons with layout animation */}
          <motion.div
            variants={revealItemVariants}
            className="flex gap-1 mb-10 p-1 rounded-xl bg-card/50 border border-border/40 w-fit backdrop-blur"
          >
            {showcaseTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={`relative px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  active === tab.key
                    ? "text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {active === tab.key && (
                  <motion.span
                    layoutId="showcase-tab-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/50 border border-border/50 shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"
            >
              {/* Text */}
              <div>
                <div
                  className="inline-flex p-3 rounded-xl mb-6"
                  style={{
                    background:
                      "color-mix(in oklch, var(--primary) 12%, transparent)",
                  }}
                >
                  <activeTab.icon className="size-5 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-4 leading-snug">
                  {activeTab.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {activeTab.body}
                </p>
                <ul className="space-y-3">
                  {activeTab.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background:
                            "color-mix(in oklch, var(--primary) 14%, transparent)",
                        }}
                      >
                        <CheckIcon className="size-3 text-primary" />
                      </span>
                      <span className="text-foreground/80">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual panel */}
              <div
                className="rounded-2xl border border-border/35 p-8 min-h-[260px] flex flex-col items-center justify-center text-center"
                style={{
                  background:
                    "color-mix(in oklch, var(--card) 60%, var(--background))",
                  boxShadow:
                    "inset 0 1px 0 color-mix(in oklch, var(--foreground) 5%, transparent)",
                }}
              >
                <activeTab.icon className="size-11 text-primary/25 mb-4" />
                <p className="text-sm text-muted-foreground/60 max-w-xs leading-relaxed">
                  {activeTab.key === "create" &&
                    "Start from a natural language prompt and get a ready-to-edit codebase."}
                  {activeTab.key === "iterate" &&
                    "Keep AI conversation and code edits in perfect sync, side by side."}
                  {activeTab.key === "deliver" &&
                    "Preview your app live, inspect terminal output, and export to GitHub."}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
};
