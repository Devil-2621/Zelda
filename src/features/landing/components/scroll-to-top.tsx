"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpIcon } from "lucide-react";

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const docEl = document.documentElement;
      const scrolled = docEl.scrollTop || document.body.scrollTop;
      const total = docEl.scrollHeight - docEl.clientHeight;
      setVisible(total > 0 && scrolled / total >= 0.25);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-full shadow-lg shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          <ArrowUpIcon className="size-4" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
