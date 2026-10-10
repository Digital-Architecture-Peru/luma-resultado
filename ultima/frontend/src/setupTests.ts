import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest no expone `afterEach` global (globals: false), por lo que Testing Library
// no registra su limpieza automática. Sin esto el DOM se acumula entre pruebas
// y getByRole encuentra varios elementos.
afterEach(() => {
  cleanup();
});
