"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/theme-toggle";

const font = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full flex justify-between items-center gap-x-4 p-2 bg-sidebar border-b px-8">
        <Link href="/" className="flex items-center gap-x-2">
          <Image
            src="/zelda-logo.webp"
            alt="Zelda Logo"
            width={28}
            height={28}
          />
          <span
            className={cn(
              "text-xl font-bold",
              font.className,
            )}
          >
            Zelda
          </span>
        </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton showName />
      </div>
    </nav>
  )
};