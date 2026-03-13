"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    const root = document.documentElement
    root.classList.add("theme-ready")

    if ("startViewTransition" in document) {
      root.classList.add("view-transition-support")
    }

    return () => {
      root.classList.remove("theme-ready")
      root.classList.remove("view-transition-support")
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}