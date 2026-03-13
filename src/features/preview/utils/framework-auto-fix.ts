import { Doc } from "../../../../convex/_generated/dataModel";
import {
  NEXTJS_CONFIG_TEMPLATE,
  BABELRC_TEMPLATE,
} from "./framework-configs";

type FileDoc = Doc<"files">;

interface AutoFixResult {
  success: boolean;
  filesCreated: Array<{
    name: string;
    content: string;
    parentId?: string;
  }>;
  message: string;
}

/**
 * Auto-generate missing Next.js configuration files for WebContainer compatibility
 */
export const autoFixNextJsConfig = (files: FileDoc[]): AutoFixResult => {
  const filesToCreate: Array<{
    name: string;
    content: string;
    parentId?: string;
  }> = [];

  // Check for next.config.js
  const hasNextConfig = files.some(
    (f) =>
      (f.name === "next.config.js" || f.name === "next.config.ts") &&
      f.type === "file"
  );

  if (!hasNextConfig) {
    filesToCreate.push({
      name: "next.config.js",
      content: NEXTJS_CONFIG_TEMPLATE,
      parentId: "", // Root level
    });
  }

  // Check for .babelrc
  const hasBabelrc = files.some(
    (f) =>
      (f.name === ".babelrc" ||
        f.name === ".babelrc.json" ||
        f.name === "babel.config.json") &&
      f.type === "file"
  );

  if (!hasBabelrc) {
    filesToCreate.push({
      name: ".babelrc",
      content: BABELRC_TEMPLATE,
      parentId: "", // Root level
    });
  }

  if (filesToCreate.length === 0) {
    return {
      success: true,
      filesCreated: [],
      message: "Next.js configuration is already correct",
    };
  }

  return {
    success: true,
    filesCreated: filesToCreate,
    message: `Created ${filesToCreate.length} configuration file(s) for WebContainer compatibility`,
  };
};

/**
 * Generate a complete Next.js starter template with proper WebContainer config
 */
export const generateNextJsStarter = (): Array<{
  name: string;
  content?: string;
  type: "file" | "folder";
  parentId?: string;
}> => {
  return [
    // Root files
    {
      name: "next.config.js",
      type: "file" as const,
      content: NEXTJS_CONFIG_TEMPLATE,
    },
    {
      name: ".babelrc",
      type: "file" as const,
      content: BABELRC_TEMPLATE,
    },
    {
      name: "package.json",
      type: "file" as const,
      content: JSON.stringify(
        {
          name: "nextjs-app",
          version: "0.1.0",
          private: true,
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint",
          },
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            next: "^14.0.0",
          },
          devDependencies: {
            typescript: "^5.0.0",
            "@types/node": "^20.0.0",
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0",
          },
        },
        null,
        2
      ),
    },
    {
      name: "tsconfig.json",
      type: "file" as const,
      content: JSON.stringify(
        {
          compilerOptions: {
            target: "ES2020",
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            jsx: "preserve",
            module: "esnext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            allowJs: true,
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            noEmit: true,
            incremental: true,
            isolatedModules: true,
            plugins: [{ name: "next" }],
            paths: {
              "@/*": ["./src/*"],
            },
          },
          include: [
            "next-env.d.ts",
            "**/*.ts",
            "**/*.tsx",
            ".next/types/**/*.ts",
          ],
          exclude: ["node_modules"],
        },
        null,
        2
      ),
    },
    {
      name: "next-env.d.ts",
      type: "file" as const,
      content: `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`,
    },
    {
      name: ".gitignore",
      type: "file" as const,
      content: `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`,
    },
    {
      name: "README.md",
      type: "file" as const,
      content: `# Next.js App

This is a Next.js application configured to run in WebContainer (browser-based environment).

## Key Configuration

This app uses **Babel** instead of **SWC** because WebContainer doesn't support native binaries:
- \`next.config.js\` disables SWC transforms
- \`.babelrc\` includes the \`next/babel\` preset

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
`,
    },
    // App directory structure (App Router)
    {
      name: "app",
      type: "folder" as const,
    },
    {
      name: "public",
      type: "folder" as const,
    },
  ];
};
