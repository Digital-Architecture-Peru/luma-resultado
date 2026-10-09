import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest no expone globals (afterEach), así que el auto-cleanup de Testing Library
// no se registra: sin esto el DOM de una prueba se acumula en la siguiente.
afterEach(() => {
  cleanup();
});
