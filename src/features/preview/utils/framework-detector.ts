import { Doc } from "../../../../convex/_generated/dataModel";

type FileDoc = Doc<"files">;

export type Framework = "nextjs" | "vite-react" | "unknown";

export interface FrameworkConfig {
  framework: Framework;
  installCommand: string;
  devCommand: string;
  buildCommand?: string;
  port: number;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  type?: string;
}

/**
 * Detect the framework from project files
 */
export const detectFramework = (files: FileDoc[]): FrameworkConfig => {
  // Find package.json
  const packageJsonFile = files.find(
    (f) => f.name === "package.json" && f.type === "file"
  );

  if (!packageJsonFile?.content) {
    return {
      framework: "unknown",
      installCommand: "npm install",
      devCommand: "npm run dev",
      port: 3000,
    };
  }

  let packageJson: PackageJson;
  try {
    packageJson = JSON.parse(packageJsonFile.content);
  } catch (error) {
    return {
      framework: "unknown",
      installCommand: "npm install",
      devCommand: "npm run dev",
      port: 3000,
    };
  }

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  // Detect Next.js
  if (allDeps.next) {
    return {
      framework: "nextjs",
      installCommand: "npm install",
      devCommand: "npm run dev",
      buildCommand: "npm run build",
      port: 3000,
    };
  }

  // Detect Vite + React
  if (allDeps.vite && (allDeps.react || allDeps["@vitejs/plugin-react"])) {
    return {
      framework: "vite-react",
      installCommand: "npm install",
      devCommand: "npm run dev",
      buildCommand: "npm run build",
      port: 3000,
    };
  }

  // Fallback: check scripts
  const scripts = packageJson.scripts || {};
  
  if (scripts.dev?.includes("next")) {
    return {
      framework: "nextjs",
      installCommand: "npm install",
      devCommand: "npm run dev",
      port: 3000,
    };
  }

  if (scripts.dev?.includes("vite")) {
    return {
      framework: "vite-react",
      installCommand: "npm install",
      devCommand: "npm run dev",
      port: 3000,
    };
  }

  return {
    framework: "unknown",
    installCommand: "npm install",
    devCommand: "npm run dev",
    port: 3000,
  };
};

/**
 * Get a human-readable framework name
 */
export const getFrameworkDisplayName = (framework: Framework): string => {
  switch (framework) {
    case "nextjs":
      return "Next.js";
    case "vite-react":
      return "Vite + React";
    case "unknown":
      return "Unknown";
  }
};

/**
 * Validate that Next.js projects have required configuration for WebContainer
 */
export const validateNextJsConfig = (files: FileDoc[]): {
  valid: boolean;
  issues: string[];
  suggestions: string[];
} => {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for next.config.js/ts
  const nextConfigFile = files.find(
    (f) =>
      (f.name === "next.config.js" || f.name === "next.config.ts") &&
      f.type === "file"
  );

  if (!nextConfigFile?.content) {
    issues.push("Missing next.config.js");
    suggestions.push(
      "Create next.config.js with: { experimental: { forceSwcTransforms: false } }"
    );
  } else {
    // Check if SWC is properly disabled
    const content = nextConfigFile.content;
    if (!content.includes("forceSwcTransforms") && !content.includes("Babel")) {
      issues.push("next.config.js doesn't disable SWC");
      suggestions.push(
        "Add 'experimental: { forceSwcTransforms: false }' to next.config.js"
      );
    }
  }

  // Check for .babelrc
  const babelrcFile = files.find(
    (f) =>
      (f.name === ".babelrc" || f.name === ".babelrc.json") &&
      f.type === "file"
  );

  if (!babelrcFile?.content) {
    issues.push("Missing .babelrc");
    suggestions.push(
      'Create .babelrc with: { "presets": ["next/babel"] }'
    );
  } else {
    const content = babelrcFile.content;
    if (!content.includes("next/babel")) {
      issues.push(".babelrc doesn't include next/babel preset");
      suggestions.push(
        'Add "next/babel" to presets in .babelrc'
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    suggestions,
  };
};
