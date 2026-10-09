import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Monto } from "./Monto";

describe("Monto", () => {
  it("given un importe en USD when se renderiza then lo formatea con 2 decimales y símbolo", () => {
    render(<Monto valor={1234.5} moneda="USD" locale="en-US" />);

    expect(screen.getByText("$1,234.50")).toBeInTheDocument();
  });

  it("given un importe entero when se renderiza then conserva los decimales", () => {
    render(<Monto valor={10} moneda="USD" locale="en-US" />);

    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });
});
