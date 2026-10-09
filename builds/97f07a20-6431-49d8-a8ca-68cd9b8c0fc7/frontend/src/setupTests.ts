import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest se ejecuta sin globals, por lo que Testing Library no registra su
// limpieza automática: sin esto el DOM se acumula entre pruebas y las
// consultas getByRole/getByLabelText encuentran varios elementos.
afterEach(() => {
  cleanup();
});
