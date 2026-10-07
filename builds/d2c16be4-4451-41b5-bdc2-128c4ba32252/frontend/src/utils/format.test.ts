import { describe, expect, it } from "vitest";
import { formatearMonto, porcentajeUtilizado } from "./format";

describe("porcentajeUtilizado", () => {
  it("given límite 5000 y disponible 3750 when calcula then 25", () => {
    expect(porcentajeUtilizado(5000, 3750)).toBe(25);
  });

  it("given límite 0 when calcula then 0", () => {
    expect(porcentajeUtilizado(0, 0)).toBe(0);
  });

  it("given disponible mayor al límite when calcula then no baja de 0", () => {
    expect(porcentajeUtilizado(100, 500)).toBe(0);
  });

  it("given disponible negativo when calcula then no supera 100", () => {
    expect(porcentajeUtilizado(100, -50)).toBe(100);
  });
});

describe("formatearMonto", () => {
  it("given 1234.5 when formatea then incluye los dígitos con dos decimales", () => {
    expect(formatearMonto(1234.5)).toMatch(/1.?234[.,]50/);
  });
});
