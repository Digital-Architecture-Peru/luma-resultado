import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TarjetaDetalle } from "../../types/tarjeta";
import { DetalleTarjeta } from "./DetalleTarjeta";

const base: TarjetaDetalle = {
  id: "1",
  ultimos4: "4242",
  marca: "VISA",
  tipo: "CREDITO",
  estado: "ACTIVA",
  moneda: "USD",
  limiteCredito: "5000.00",
  saldoDisponible: "3250.75",
  vencimiento: "2028-11-30",
};

describe("DetalleTarjeta", () => {
  it("given crédito when renderiza then muestra límite y saldo", () => {
    render(<DetalleTarjeta tarjeta={base} />);
    expect(screen.getByText("5,000.00")).toBeInTheDocument();
    expect(screen.getByText("3,250.75")).toBeInTheDocument();
    expect(screen.getByText("2028-11-30")).toBeInTheDocument();
  });

  it("given débito sin límite when renderiza then muestra No aplica", () => {
    render(<DetalleTarjeta tarjeta={{ ...base, tipo: "DEBITO", limiteCredito: null }} />);
    expect(screen.getByText("No aplica")).toBeInTheDocument();
  });
});
