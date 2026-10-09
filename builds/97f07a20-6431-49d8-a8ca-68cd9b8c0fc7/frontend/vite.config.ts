import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// En desarrollo, /api se reenvía al backend Quarkus (sin CORS abierto).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.BACKEND_URL ?? 'http://localhost:8080',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
