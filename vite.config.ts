import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// BASE_PATH is set by the deploy workflow to "/<repo-name>/" for GitHub Pages.
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    environment: "node",
  },
});
