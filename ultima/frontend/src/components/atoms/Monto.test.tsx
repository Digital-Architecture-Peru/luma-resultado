import { describe, expect, it } from "vitest";
import { formatearMonto } from "./Monto";

describe("formatearMonto", () => {
  it("given decimal con miles when formatea then agrupa y conserva decimales", () => {
    expect(formatearMonto("1234567.8")).toBe("1,234,567.80");
  });

  it("given entero sin decimales when formatea then agrega .00", () => {
    expect(formatearMonto("5000")).toBe("5,000.00");
  });

  it("given cero when formatea then 0.00", () => {
    expect(formatearMonto("0.00")).toBe("0.00");
  });

  it("given negativo when formatea then conserva signo", () => {
    expect(formatearMonto("-1500.5")).toBe("-1,500.50");
  });
});
