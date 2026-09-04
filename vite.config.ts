import { defineConfig } from "vite";

// Relative base so the same build works served from a web root *and*
// loaded off disk by the desktop (Electron) shell via file://.
export default defineConfig({
  base: "./",
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
  server: { port: 4319 },
});
