import { defineConfig } from 'vitest/config';

// Los decoradores de Angular se evalúan en modo JIT durante las pruebas (ver src/test-setup.ts).
export default defineConfig({
  esbuild: {
    tsconfigRaw: {
      compilerOptions: { experimentalDecorators: true, useDefineForClassFields: false },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
  },
});
