import { defineConfig } from "vite";

// tongmon.github.io is a user site, so it is served from the domain root.
export default defineConfig({
  base: "/",
  build: {
    assetsInlineLimit: 0,
  },
});
