import { describe, expect, it, vi } from "vitest";
import { ApiError, crearTarjetasApi } from "./tarjetasApi";

function respuesta(status: number, cuerpo: unknown): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Mock tipado con la firma de fetch: permite inspeccionar mock.calls[n][0|1] sin error de tupla vacía.
function fetchQueResponde(status: number, cuerpo: unknown) {
  return vi.fn<typeof fetch>(async () => respuesta(status, cuerpo));
}

describe("tarjetasApi", () => {
  it("given cliente when listar then llama a /api/v1/tarjetas con X-Cliente-Id", async () => {
    const fetchImpl = fetchQueResponde(200, []);
    const api = crearTarjetasApi({ baseUrl: "http://x/", clienteId: "c-1", fetchImpl });

    await expect(api.listar()).resolves.toEqual([]);

    expect(fetchImpl).toHaveBeenCalledWith("http://x/api/v1/tarjetas", {
      headers: { Accept: "application/json", "X-Cliente-Id": "c-1" },
    });
  });

  it("given id when detalle then codifica el id en la ruta", async () => {
    const fetchImpl = fetchQueResponde(200, { id: "a b" });
    const api = crearTarjetasApi({ baseUrl: "http://x", clienteId: "c", fetchImpl });

    await api.detalle("a b");

    expect(fetchImpl.mock.calls[0]?.[0]).toBe("http://x/api/v1/tarjetas/a%20b");
  });

  it("given 404 when detalle then lanza ApiError con status", async () => {
    const fetchImpl = fetchQueResponde(404, { title: "No encontrado" });
    const api = crearTarjetasApi({ baseUrl: "http://x", clienteId: "c", fetchImpl });

    await expect(api.detalle("z")).rejects.toMatchObject({ name: "ApiError", status: 404 });
    await expect(api.detalle("z")).rejects.toBeInstanceOf(ApiError);
  });

  it("given 500 when listar then mensaje genérico sin detalle interno", async () => {
    const fetchImpl = fetchQueResponde(500, { detail: "stacktrace" });
    const api = crearTarjetasApi({ baseUrl: "http://x", clienteId: "c", fetchImpl });

    await expect(api.listar()).rejects.toThrow("No pudimos consultar tus tarjetas. Intenta nuevamente.");
  });
});
