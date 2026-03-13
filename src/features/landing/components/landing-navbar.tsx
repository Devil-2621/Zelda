import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export const LandingNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`mx-4 md:mx-6 lg:mx-auto lg:max-w-6xl transition-all duration-500 ${
          scrolled
            ? "mt-3 rounded-2xl border border-border/50 bg-background/85 backdrop-blur-xl shadow-xl shadow-black/10 px-4 py-2"
            : "mt-0 px-4 py-4 md:px-6"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/zelda-logo.webp"
              alt="Zelda logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="text-xl font-semibold tracking-tight">Zelda</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="transition-colors hover:text-foreground"
            >
              Workflow
            </Link>
            <Link
              href="#faq"
              className="transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="group">
                  Start building
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/projects">
                <Button size="sm" className="group">
                  Open app
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={
          mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden mx-4 md:hidden"
      >
        <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-4 mt-2 space-y-1">
          <Link
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#workflow"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            Workflow
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            FAQ
          </Link>
          <div className="pt-3 border-t border-border/50 flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="flex-1">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="flex-1">
                  Start building
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/projects" className="flex-1">
                <Button size="sm" className="w-full">
                  Open app
                </Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};
