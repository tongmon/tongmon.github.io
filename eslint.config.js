import mantine from "eslint-config-mantine";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  tseslint.configs.recommended,
  ...mantine,
  {
    ignores: [
      "dist/**",
      "public/content/posts/**",
      "src/shared/generated/posts-manifest.ts",
      "**/*.{mjs,cjs,js,d.ts,d.mts}",
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: process.cwd(),
      },
    },
  },
);
