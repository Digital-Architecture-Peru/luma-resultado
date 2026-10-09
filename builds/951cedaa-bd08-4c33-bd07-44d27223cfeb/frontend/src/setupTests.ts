import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest sin `globals` no registra el cleanup automático de Testing Library:
// sin esto el DOM de una prueba persiste en la siguiente (getByRole encuentra varios botones).
afterEach(() => {
  cleanup();
});
