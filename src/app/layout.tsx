import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { TooltipProvider } from "@/components/ui/tooltip";

import "allotment/dist/style.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zelda",
  description: "Zelda is a cloud IDE built with Next.js.",
  icons: {
    icon: "/zelda-logo-white.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${plexMono.variable} antialiased`}
        >
          <TooltipProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </TooltipProvider>
        </body>
      </html>
  );
}
