"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { HeroSection } from "@/features/landing/components/hero";
import { ProofStrip } from "@/features/landing/components/proof-strip";
import { FeatureSection } from "@/features/landing/components/feature-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works";
import { ShowcaseSection } from "@/features/landing/components/showcase";
import { UseCasesSection } from "@/features/landing/components/use-cases";
import { FaqSection } from "@/features/landing/components/faq";
import { FinalCtaSection } from "@/features/landing/components/final-cta";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { ScrollToTopButton } from "@/features/landing/components/scroll-to-top";

export const LandingPage = () => {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = hydrated ? Boolean(prefersReducedMotion) : false;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <LandingNavbar />

      <main>
        <HeroSection reduceMotion={reduceMotion} />
        <ProofStrip reduceMotion={reduceMotion} />
        <FeatureSection reduceMotion={reduceMotion} />
        <HowItWorksSection reduceMotion={reduceMotion} />
        <ShowcaseSection reduceMotion={reduceMotion} />
        <UseCasesSection reduceMotion={reduceMotion} />
        <FaqSection reduceMotion={reduceMotion} />
        <FinalCtaSection reduceMotion={reduceMotion} />
      </main>

      <LandingFooter />
      <ScrollToTopButton />
    </div>
  );
};
