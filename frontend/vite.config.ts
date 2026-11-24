import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'react-vendor';
            }

            if (id.includes('@tanstack')) {
              return 'query-vendor';
            }

            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }

            if (id.includes('motion')) {
              return 'motion-vendor';
            }

            if (id.includes('maplibre') || id.includes('leaflet')) {
              return 'map-vendor';
            }

            return 'vendor';
          }
        },
      },
    },
  },
};

export default defineConfig(({ command, mode }) => {
  const envDir = fileURLToPath(new URL('.', import.meta.url));
  const apiBaseUrl = loadEnv(mode, envDir, 'VITE_API_BASE_URL').VITE_API_BASE_URL?.trim();

  if (command === 'build' && !apiBaseUrl) {
    throw new Error('Set VITE_API_BASE_URL to the backend URL before building the frontend.');
  }

  if (apiBaseUrl) {
    const url = URL.canParse(apiBaseUrl) ? new URL(apiBaseUrl) : null;
    if (!url || !/^https?:\/\//i.test(apiBaseUrl) || url.username || url.password || /[?#]/.test(apiBaseUrl)) {
      throw new Error('VITE_API_BASE_URL must be an absolute HTTP(S) URL without credentials, a query, or a fragment.');
    }
  }

  return config;
});
