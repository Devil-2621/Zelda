"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { revealItemVariants } from "@/features/landing/components/landing-motion";
import { Reveal } from "@/features/landing/components/scroll-reveal";

export const FinalCtaSection = ({ reduceMotion }: { reduceMotion: boolean }) => {
  return (
    <section className="relative py-32 md:py-44 overflow-hidden">
      {/* Dramatic gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 50% 55%, color-mix(in oklch, var(--primary) 22%, transparent), transparent 70%)",
        }}
      />
      {/* Noise-like grain overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
        <Reveal reduceMotion={reduceMotion} amount={0.25}>
          <motion.p
            variants={revealItemVariants}
            className="text-sm font-medium text-primary mb-6"
          >
            Ready to build?
          </motion.p>
          <motion.h2
            variants={revealItemVariants}
            className="text-[clamp(2.5rem,7vw,6rem)] font-semibold tracking-[-0.03em] leading-[0.93] mb-8"
          >
            Launch your next
            <br />
            <span className="text-primary">product cycle.</span>
          </motion.h2>
          <motion.p
            variants={revealItemVariants}
            className="text-muted-foreground text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed"
          >
            One workspace for creation, AI implementation, preview validation,
            and GitHub delivery.
          </motion.p>
          <motion.div
            variants={revealItemVariants}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <SignedOut>
              <SignUpButton mode="modal">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Button size="lg" className="group h-12 px-8 text-base">
                    Create free account
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base border-border/50"
                >
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/projects">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Button size="lg" className="group h-12 px-8 text-base">
                    Open your projects
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
            </SignedIn>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
};
