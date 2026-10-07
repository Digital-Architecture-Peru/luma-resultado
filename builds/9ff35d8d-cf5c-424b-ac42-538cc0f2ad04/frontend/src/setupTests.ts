import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest sin `globals` no activa el cleanup automático de Testing Library:
// se desmonta el DOM tras cada prueba para evitar fugas entre tests.
afterEach(() => {
  cleanup();
});
