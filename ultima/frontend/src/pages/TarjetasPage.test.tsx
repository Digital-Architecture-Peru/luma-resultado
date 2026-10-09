import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { TarjetasApi } from "../services/tarjetasApi";
import { ApiError } from "../services/tarjetasApi";
import type { TarjetaDetalle, TarjetaResumen } from "../types/tarjeta";
import { TarjetasPage } from "./TarjetasPage";

const resumen: TarjetaResumen = {
  id: "1",
  ultimos4: "4242",
  marca: "VISA",
  tipo: "CREDITO",
  estado: "ACTIVA",
  moneda: "USD",
  saldoDisponible: "3250.75",
  vencimiento: "2028-11-30",
};
const detalle: TarjetaDetalle = { ...resumen, limiteCredito: "5000.00" };

describe("TarjetasPage", () => {
  it("given API ok when selecciona tarjeta then muestra detalle", async () => {
    const api: TarjetasApi = {
      listar: vi.fn(async () => [resumen]),
      detalle: vi.fn(async () => detalle),
    };
    render(<TarjetasPage api={api} />);

    await userEvent.click(await screen.findByRole("button", { name: /VISA/ }));

    expect(await screen.findByText("5,000.00")).toBeInTheDocument();
    expect(api.detalle).toHaveBeenCalledWith("1");
  });

  it("given API falla when carga then muestra alerta", async () => {
    const api: TarjetasApi = {
      listar: vi.fn(async () => {
        throw new ApiError(500, "No pudimos consultar tus tarjetas. Intenta nuevamente.");
      }),
      detalle: vi.fn(),
    };
    render(<TarjetasPage api={api} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos consultar");
  });
});
