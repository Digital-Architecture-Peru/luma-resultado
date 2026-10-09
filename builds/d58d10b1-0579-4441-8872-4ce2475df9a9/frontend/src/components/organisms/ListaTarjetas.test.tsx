import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { TarjetaResumen } from "../../types/tarjeta";
import { ListaTarjetas } from "./ListaTarjetas";

const tarjetas: TarjetaResumen[] = [
  {
    id: "1",
    ultimos4: "4242",
    marca: "VISA",
    tipo: "CREDITO",
    estado: "ACTIVA",
    moneda: "USD",
    saldoDisponible: "3250.75",
    vencimiento: "2028-11-30",
  },
  {
    id: "2",
    ultimos4: "1881",
    marca: "MASTERCARD",
    tipo: "DEBITO",
    estado: "BLOQUEADA",
    moneda: "USD",
    saldoDisponible: "10",
    vencimiento: "2027-06-30",
  },
];

describe("ListaTarjetas", () => {
  it("given lista vacía when renderiza then muestra mensaje vacío", () => {
    render(<ListaTarjetas tarjetas={[]} seleccionadaId={null} onSeleccionar={vi.fn()} />);
    expect(screen.getByText("No tienes tarjetas registradas.")).toBeInTheDocument();
  });

  it("given tarjetas when renderiza then muestra últimos 4 y nunca un PAN completo", () => {
    render(<ListaTarjetas tarjetas={tarjetas} seleccionadaId={null} onSeleccionar={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByLabelText("Tarjeta terminada en 4242")).toBeInTheDocument();
    expect(screen.getByText("3,250.75")).toBeInTheDocument();
  });

  it("given tarjeta when clic then notifica el id", async () => {
    const onSeleccionar = vi.fn();
    render(<ListaTarjetas tarjetas={tarjetas} seleccionadaId="1" onSeleccionar={onSeleccionar} />);
    const botones = screen.getAllByRole("button");
    expect(botones[0]).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(botones[1] as HTMLElement);
    expect(onSeleccionar).toHaveBeenCalledWith("2");
  });
});
