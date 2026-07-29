import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** Prefer design tokens from globals.css (surface-*, brand-*, primary, danger, …). */
const bannedColorClass =
  String.raw`\b(?:text-black|bg-white|text-gray-|bg-gray-|border-gray-|from-gray-|to-gray-|via-gray-|text-slate-|bg-slate-|border-slate-|from-slate-|to-slate-|via-slate-|from-blue-50|to-blue-50|via-blue-50|from-indigo-50|from-purple-50|from-cyan-50|bg-red-50|text-red-[0-9]|bg-red-[0-9]|border-red-[0-9]|bg-green-50|text-green-[0-9]|bg-green-[0-9]|bg-blue-[0-9]|text-blue-[0-9]|border-blue-[0-9]|from-blue-[0-9]|via-blue-[0-9]|to-blue-[0-9]|from-indigo-[0-9]|to-indigo-[0-9]|via-indigo-[0-9])`;

const designTokenMessage =
  "Usa tokens de diseño (bg-surface-*, text-foreground, text-fg-muted, bg-primary, text-primary-foreground, border-border, success/warning/danger/info, brand-*). Ver globals.css.";

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: `Literal[value=/${bannedColorClass}/]`,
          message: designTokenMessage,
        },
        {
          selector: `TemplateElement[value.cooked=/${bannedColorClass}/]`,
          message: designTokenMessage,
        },
      ],
    },
  },
  {
    // Banda dark institucional intencional (Footer + Ubicacion).
    files: [
      "src/components/public/footer/Footer.tsx",
      "src/components/public/sections/UbicacionSection.tsx",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
];

export default eslintConfig;
 