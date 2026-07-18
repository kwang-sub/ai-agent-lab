import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    globals: true,
    restoreMocks: true,
    pool: "threads",
    maxWorkers: 4,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
