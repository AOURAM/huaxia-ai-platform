import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "react-vendor";
            }

            if (id.includes("@tanstack")) {
              return "query-vendor";
            }

            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }

            if (id.includes("framer-motion")) {
              return "motion-vendor";
            }

            if (id.includes("maplibre") || id.includes("leaflet")) {
              return "map-vendor";
            }

            return "vendor";
          }
        },
      },
    },
  },
});