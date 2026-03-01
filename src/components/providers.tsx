"use client";

import {
  Authenticated,
  Unauthenticated,
  ConvexReactClient,
  AuthLoading,
} from "convex/react";
import { ClerkProvider, useAuth, UserButton } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { UnauthenticatedView } from "@/features/auth/components/unauthenticated-view";
import { AuthLoadingView } from "@/features/auth/components/auth-loading-view";

import { shadcn } from "@clerk/themes";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing!, NEXT_PUBLIC_CONVEX_URL environment variable is not set");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <ClerkProvider appearance={{
        theme: shadcn,
      }}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Authenticated>
            <UserButton />
            {children}
          </Authenticated>
          <Unauthenticated>
            <UnauthenticatedView />
          </Unauthenticated>
          <AuthLoading>
            <AuthLoadingView />
          </AuthLoading>
          <ThemeToggle />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ThemeProvider>
  );
};
