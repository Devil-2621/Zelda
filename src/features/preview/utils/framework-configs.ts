/**
 * Configuration templates for different frameworks to work in WebContainer
 */

export const NEXTJS_CONFIG_TEMPLATE = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC (native binary) - use Babel instead for WebContainer compatibility
  experimental: {
    forceSwcTransforms: false,
  },
};

module.exports = nextConfig;
`;

export const NEXTJS_TYPESCRIPT_CONFIG_TEMPLATE = `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable SWC (native binary) - use Babel instead for WebContainer compatibility
  experimental: {
    forceSwcTransforms: false,
  },
};

export default nextConfig;
`;

export const BABELRC_TEMPLATE = `{
  "presets": ["next/babel"]
}
`;

export const VITE_CONFIG_TEMPLATE = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Required for WebContainer port forwarding
  },
});
`;

export const NEXTJS_BASE_PACKAGE_JSON = {
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
};

export const VITE_REACT_BASE_PACKAGE_JSON = {
  name: "vite-react-app",
  version: "0.0.1",
  type: "module",
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
  },
  dependencies: {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
  },
  devDependencies: {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    typescript: "^5.0.0",
    vite: "^5.0.0",
  },
};

export const NEXTJS_TSCONFIG = {
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
  include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  exclude: ["node_modules"],
};

export const VITE_REACT_TSCONFIG = {
  compilerOptions: {
    target: "ES2020",
    useDefineForClassFields: true,
    lib: ["ES2020", "DOM", "DOM.Iterable"],
    module: "ESNext",
    skipLibCheck: true,
    moduleResolution: "bundler",
    allowImportingTsExtensions: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: "react-jsx",
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
  },
  include: ["src"],
  references: [{ path: "./tsconfig.node.json" }],
};
