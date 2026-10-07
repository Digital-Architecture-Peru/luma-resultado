import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";
import type { Tarjeta } from "./model/tarjeta";
import type { TarjetasApi } from "./services/tarjetasApi";

const tarjeta: Tarjeta = {
  id: "t-001",
  numeroEnmascarado: "**** **** **** 1234",
  titular: "Ana Ejemplo",
  tipo: "CREDITO",
  estado: "ACTIVA",
  marca: "VISA",
  limite: 5000,
  saldoDisponible: 3750,
  vencimiento: "08/28",
};

describe("App", () => {
  it("given API con una tarjeta when carga then la muestra enmascarada", async () => {
    const api: TarjetasApi = { listar: vi.fn().mockResolvedValue([tarjeta]) };
    render(<App api={api} />);
    expect(screen.getByRole("status").textContent).toContain("Cargando");
    await waitFor(() => expect(screen.getByText("**** **** **** 1234")).toBeTruthy());
    const articulo = screen.getByRole("article");
    expect(within(articulo).getByText("Activa")).toBeTruthy();
  });

  it("given API que falla when carga then muestra alerta", async () => {
    const api: TarjetasApi = { listar: vi.fn().mockRejectedValue(new Error("Servicio caído")) };
    render(<App api={api} />);
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("Servicio caído"));
  });

  it("given API sin tarjetas when carga then muestra estado vacío", async () => {
    const api: TarjetasApi = { listar: vi.fn().mockResolvedValue([]) };
    render(<App api={api} />);
    await waitFor(() => expect(screen.getByText(/No hay tarjetas/)).toBeTruthy());
  });
});
