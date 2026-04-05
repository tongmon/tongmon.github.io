import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  // base: "/tongmon.github.io/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.mjs",
  },

  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
