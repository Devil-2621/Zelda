import Image from "next/image";
import Link from "next/link";

export const LandingFooter = () => {
  return (
    <footer className="border-t border-border/35 py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/zelda-logo.webp"
              alt="Zelda"
              width={26}
              height={26}
              className="rounded-sm opacity-80"
            />
            <span className="text-lg font-semibold">Zelda</span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="hover:text-foreground transition-colors duration-200"
            >
              Workflow
            </Link>
            <Link
              href="#faq"
              className="hover:text-foreground transition-colors duration-200"
            >
              FAQ
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Zelda. Built for faster product
            development.
          </p>
        </div>
      </div>
    </footer>
  );
};
