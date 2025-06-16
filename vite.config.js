import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // 512bytes 이하의 이미지 파일은 base64로 처리
    assetsInlineLimit: 512,
  },
  assetsInclude: ["**/*.md"],
});
