import { describe, expect, it, vi } from "vitest";
import { crearTarjetasApi } from "./tarjetasApi";

function respuesta(ok: boolean, status: number, cuerpo: unknown): Response {
  return { ok, status, json: () => Promise.resolve(cuerpo) } as unknown as Response;
}

describe("crearTarjetasApi", () => {
  it("given filtro TODAS when lista then llama sin query", async () => {
    const fetcher = vi.fn().mockResolvedValue(respuesta(true, 200, []));
    await crearTarjetasApi(fetcher).listar("TODAS");
    expect(fetcher).toHaveBeenCalledWith("/api/v1/tarjetas");
  });

  it("given filtro ACTIVA when lista then envía el estado", async () => {
    const fetcher = vi.fn().mockResolvedValue(respuesta(true, 200, []));
    await crearTarjetasApi(fetcher).listar("ACTIVA");
    expect(fetcher).toHaveBeenCalledWith("/api/v1/tarjetas?estado=ACTIVA");
  });

  it("given HTTP 500 when lista then rechaza con mensaje", async () => {
    const fetcher = vi.fn().mockResolvedValue(respuesta(false, 500, {}));
    await expect(crearTarjetasApi(fetcher).listar("TODAS")).rejects.toThrow("HTTP 500");
  });
});
