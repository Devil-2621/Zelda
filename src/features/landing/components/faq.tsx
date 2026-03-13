"use client";

import { motion } from "motion/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/features/landing/components/landing-content";
import { revealItemVariants } from "@/features/landing/components/landing-motion";
import { Reveal } from "@/features/landing/components/scroll-reveal";

export const FaqSection = ({ reduceMotion }: { reduceMotion: boolean }) => {
  return (
    <section
      id="faq"
      className="py-24 md:py-32 relative"
      style={{
        background:
          "color-mix(in oklch, var(--card) 30%, var(--background))",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <Reveal reduceMotion={reduceMotion} amount={0.3} className="mb-14">
          <motion.p
            variants={revealItemVariants}
            className="text-sm font-medium text-primary mb-3"
          >
            Questions
          </motion.p>
          <motion.h2
            variants={revealItemVariants}
            className="text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-tight leading-[1.05]"
          >
            Answers before
            <br />
            you start.
          </motion.h2>
        </Reveal>

        <Reveal reduceMotion={reduceMotion} amount={0.15} margin="0px 0px -60px 0px">
          <motion.div variants={revealItemVariants}>
            <Accordion type="single" collapsible>
              {faqs.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="border-t border-border/40 last:border-b border-b-0"
                >
                  <AccordionTrigger className="text-left py-6 text-base font-medium hover:no-underline hover:text-primary transition-colors duration-200 [&>svg]:text-primary/50 [&>svg]:shrink-0">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 text-sm leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
};
