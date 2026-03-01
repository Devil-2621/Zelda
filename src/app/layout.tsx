import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zelda",
  description: "Zelda is a cloud IDE built with Next.js.",
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * Root application layout that wraps pages with authentication, global fonts, and theme management.
 *
 * @returns The root JSX element that wraps `children` with Clerk authentication and a ThemeProvider, and applies HTML `lang="en"`, font CSS variables, and antialiasing to the document body.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <Providers>{children}</Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
