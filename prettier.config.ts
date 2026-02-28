import type { Options } from "prettier";

const config: Options = {
  // Core formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: true,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  jsxSingleQuote: false,
  arrowParens: "always",
  proseWrap: "preserve",
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",

  // Ignore file (create a .prettierignore at repo root with entries like: .gitignore, dist/, node_modules/)
  ignorePath: ".prettierignore",

  // Plugins (install only the ones you need in package.json)
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-sort-imports",
  ],

  // File-specific overrides
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: {
        parser: "typescript",
      },
    },
    {
      files: ["*.json", "*.json5", "*.jsonc"],
      options: {
        tabWidth: 2,
      },
    },
    {
      files: ["*.md"],
      options: {
        proseWrap: "always",
      },
    },
  ],
};

export default config;
