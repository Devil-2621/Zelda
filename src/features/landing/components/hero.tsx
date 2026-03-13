import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDownIcon, ArrowRightIcon, SparklesIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

// ─── Terminal typewriter animation ───────────────────────────────────────────
const CMD_PREFIX = "❯ create project ";
const CMD_ARG = '"saas onboarding flow"';
const FULL_CMD = CMD_PREFIX + CMD_ARG;
const FILES = [
  "+ src/app/layout.tsx",
  "+ src/features/auth/",
  "+ src/features/onboarding/",
];

type TermPhase =
  | "idle"
  | "typing"
  | "scaffolding"
  | "files"
  | "done"
  | "resetting";

const TerminalAnimation = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const [phase, setPhase] = useState<TermPhase>("idle");
  const [typedLen, setTypedLen] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [doneFlash, setDoneFlash] = useState(false);

  // Kick off after terminal enters (~600ms after mount)
  useEffect(() => {
    if (reduceMotion) return;
    const t = setTimeout(() => setPhase("typing"), 600);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  // Typewriter
  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen < FULL_CMD.length) {
      const t = setTimeout(() => setTypedLen((n) => n + 1), 30);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("scaffolding"), 350);
    return () => clearTimeout(t);
  }, [phase, typedLen]);

  // Scaffolding → start files
  useEffect(() => {
    if (phase !== "scaffolding") return;
    const t = setTimeout(() => setPhase("files"), 1100);
    return () => clearTimeout(t);
  }, [phase]);

  // Files appear one by one
  useEffect(() => {
    if (phase !== "files") return;
    if (fileCount < FILES.length) {
      const t = setTimeout(() => setFileCount((n) => n + 1), 360);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhase("done");
      setDoneFlash(true);
      setTimeout(() => setDoneFlash(false), 700);
    }, 300);
    return () => clearTimeout(t);
  }, [phase, fileCount]);

  // Done → reset loop
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => {
      setPhase("resetting");
      setTimeout(() => {
        setTypedLen(0);
        setFileCount(0);
        setPhase("typing");
      }, 600);
    }, 4500);
    return () => clearTimeout(t);
  }, [phase]);

  const showCursor =
    phase === "typing" || phase === "done" || phase === "resetting";
  const isDone = phase === "done" || phase === "resetting";
  const isResetting = phase === "resetting";

  if (reduceMotion) {
    return (
      <div className="p-5 font-mono text-xs space-y-2.5">
        <div className="text-muted-foreground">
          <span className="text-primary">❯</span> create project{" "}
          <span className="text-foreground">&quot;saas onboarding flow&quot;</span>
        </div>
        {FILES.map((f) => (
          <div key={f} className="text-muted-foreground/60">
            {f}
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-green-400">✓</span>
          <span className="text-foreground/90">
            Ready for preview — port 3000
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={isResetting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-5 font-mono text-xs space-y-2.5"
    >
      {/* Command line with typewriter */}
      <div className="text-muted-foreground flex items-baseline">
        {typedLen > 0 && (
          <>
            <span className="text-primary mr-1">❯</span>
            <span>
              {/* "create project " plain */}
              {FULL_CMD.slice(1, Math.min(typedLen, CMD_PREFIX.length))}
              {/* quoted arg in foreground color */}
              {typedLen > CMD_PREFIX.length && (
                <span className="text-foreground">
                  {FULL_CMD.slice(CMD_PREFIX.length, typedLen)}
                </span>
              )}
            </span>
          </>
        )}
        {phase === "typing" && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="ml-0.5 inline-block w-[2px] h-[10px] bg-primary align-middle"
          />
        )}
      </div>

      {/* Scaffolding spinner */}
      <AnimatePresence>
        {(phase === "scaffolding" || phase === "files") && (
          <motion.div
            key="scaffolding"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: [0.6, 1, 0.6], x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{
              opacity: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 0.25 },
            }}
            className="text-primary/80"
          >
            ✦ Scaffolding project structure...
          </motion.div>
        )}
      </AnimatePresence>

      {/* File lines */}
      {FILES.slice(0, fileCount).map((file) => (
        <motion.div
          key={file}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="text-muted-foreground/60"
        >
          {file}
        </motion.div>
      ))}

      {/* Done line */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 pt-1"
          >
            <motion.span
              animate={
                doneFlash
                  ? { scale: [1, 1.6, 1], opacity: [1, 0.7, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.5 }}
              className="text-green-400"
            >
              ✓
            </motion.span>
            <motion.span
              animate={
                doneFlash
                  ? { color: ["#4ade80", "var(--foreground)"] }
                  : {}
              }
              transition={{ duration: 0.6 }}
              className="text-foreground/90"
            >
              Ready for preview — port 3000
            </motion.span>
            {showCursor && phase === "done" && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-[2px] h-[10px] bg-primary align-middle"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WordReveal = ({
  text,
  className,
  delay = 0,
  reduceMotion,
}: {
  text: string;
  className?: string;
  delay?: number;
  reduceMotion: boolean;
}) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: "bottom" }}
        >
          <motion.span
            initial={reduceMotion ? false : { y: "105%", rotateX: "12deg" }}
            animate={{ y: "0%", rotateX: "0deg" }}
            transition={{
              duration: 0.72,
              delay: delay + i * 0.065,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {word}
            {i < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export const HeroSection = ({ reduceMotion }: { reduceMotion: boolean }) => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-28">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.18, 1], opacity: [0.35, 0.55, 0.35] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 h-[680px] w-[680px] rounded-full blur-[120px]"
          style={{
            background:
              "color-mix(in oklch, var(--primary) 22%, transparent)",
          }}
        />
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.12, 1], opacity: [0.2, 0.36, 0.2] }
          }
          transition={{
            duration: 15,
            delay: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[30%] -left-[15%] h-[480px] w-[480px] rounded-full blur-[100px]"
          style={{
            background:
              "color-mix(in oklch, var(--primary) 15%, transparent)",
          }}
        />
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.1, 1], opacity: [0.15, 0.28, 0.15] }
          }
          transition={{
            duration: 13,
            delay: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[25%] -right-[15%] h-[400px] w-[400px] rounded-full blur-[90px]"
          style={{
            background:
              "color-mix(in oklch, var(--primary) 12%, transparent)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full">
        {/* Badge */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
            <SparklesIcon className="size-3.5" />
            Cloud IDE — AI-first workflow, human in control
          </span>
        </motion.div>

        {/* Hero headline */}
        <div className="text-center perspective-[1200px]">
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.03em]">
            <span className="block">
              <WordReveal
                text="Build products"
                delay={0.2}
                reduceMotion={reduceMotion}
              />
            </span>
            <span className="block">
              {/* "with " plain */}
              <span
                className="inline-block overflow-hidden"
                style={{ verticalAlign: "bottom" }}
              >
                <motion.span
                  initial={reduceMotion ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.72, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "inline-block" }}
                >
                  with&nbsp;
                </motion.span>
              </span>
              {/* "human" pink */}
              <span
                className="inline-block overflow-hidden hover:bg-primary/20 transition-all ease-in-out rounded-2xl hover:scale-105"
                style={{ verticalAlign: "bottom" }}
              >
                <motion.span
                  initial={reduceMotion ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.72, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-primary"
                >
                  Human
                </motion.span>
              </span>
              {/* " &" separator */}
              <span
                className="inline-block overflow-hidden"
                style={{ verticalAlign: "bottom" }}
              >
                <motion.span
                  initial={reduceMotion ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.72, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "inline-block" }}
                  className="text-foreground/30"
                >
                  &nbsp;+&nbsp;
                </motion.span>
              </span>
              {/* "AI" pink */}
              <span
                className="inline-block overflow-hidden hover:bg-primary/20 transition-all ease-in-out rounded-2xl hover:scale-105"
                style={{ verticalAlign: "bottom" }}
              >
                <motion.span
                  initial={reduceMotion ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.72, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-primary"
                >
                  AI
                </motion.span>
              </span>
            </span>
            <span className="block">
              <WordReveal
                text="in Zelda."
                delay={0.5}
                reduceMotion={reduceMotion}
              />
            </span>
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-8 max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed"
          >
            Create projects from prompts, code with AI context in a side
            conversation, run live preview, and ship to GitHub — all in one
            workspace.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <SignedOut>
              <SignUpButton mode="modal">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Button size="lg" className="group h-12 px-7 text-base">
                    Start building free
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </SignUpButton>
              <SignInButton mode="modal">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-7 text-base border-border/60"
                  >
                    Sign in
                  </Button>
                </motion.div>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/projects">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Button size="lg" className="group h-12 px-7 text-base">
                    Open your workspace
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
            </SignedIn>
          </motion.div>
        </div>

        {/* Floating terminal */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: 1.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto mt-16 max-w-2xl"
        >
          <motion.div
            animate={
              reduceMotion ? undefined : { y: [0, -7, 0] }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="rounded-2xl border border-border/50 bg-card/60 p-1 backdrop-blur-xl"
            style={{
              boxShadow:
                "0 32px 80px color-mix(in oklch, var(--primary) 18%, transparent), 0 0 0 1px color-mix(in oklch, var(--primary) 8%, transparent)",
            }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-red-500/60" />
                <span className="size-3 rounded-full bg-yellow-500/60" />
                <span className="size-3 rounded-full bg-green-500/60" />
              </div>
              <span className="mx-auto text-xs text-muted-foreground font-mono">
                zelda — workspace
              </span>
            </div>
            {/* Terminal content */}
            <TerminalAnimation reduceMotion={reduceMotion} />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-muted-foreground/40"
        >
          <span className="text-[10px] uppercase tracking-widest font-medium">
            Scroll
          </span>
          <ArrowDownIcon className="size-3.5" />
        </motion.div>
      </motion.div>
    </section>
  );
};
