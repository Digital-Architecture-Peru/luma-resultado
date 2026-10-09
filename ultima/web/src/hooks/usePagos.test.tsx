import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PagosApi } from "../services/pagosApi";
import type { FiltroPagos, PagedResult, Pago } from "../types/pago";
import { usePagos } from "./usePagos";

const filtro: FiltroPagos = { page: 1, pageSize: 10 };

const respuesta: PagedResult<Pago> = {
  items: [
    {
      id: "00000000-0000-0000-0000-000000000001",
      referencia: "REF-1",
      beneficiario: "Demo",
      cuentaDestino: "****1111",
      monto: 10,
      moneda: "USD",
      estado: "PENDIENTE",
      fechaPago: "2026-10-01T10:00:00Z",
    },
  ],
  page: 1,
  pageSize: 10,
  total: 1,
};

function crearApi(listar: PagosApi["listar"]): PagosApi {
  return { listar, obtener: vi.fn() };
}

describe("usePagos", () => {
  it("given una API que responde when se monta then pasa de loading a success", async () => {
    const api = crearApi(vi.fn(async () => respuesta));

    const { result } = renderHook(() => usePagos(api, filtro));

    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current).toEqual({ status: "success", data: respuesta });
  });

  it("given una API que falla when se monta then expone el mensaje de error", async () => {
    const api = crearApi(
      vi.fn(async () => {
        throw new Error("Servicio no disponible");
      }),
    );

    const { result } = renderHook(() => usePagos(api, filtro));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current).toEqual({ status: "error", message: "Servicio no disponible" });
  });
});
