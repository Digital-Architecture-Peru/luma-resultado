import { describe, expect, it, vi } from "vitest";
import { createPagosApi, PagosApiError } from "./pagosApi";

function respuestaJson(cuerpo: unknown, status = 200): Response {
  return { ok: status >= 200 && status < 300, status, json: async () => cuerpo } as unknown as Response;
}

describe("pagosApi", () => {
  it("given un filtro when lista then arma la URL con query y envía X-Cliente-Id", async () => {
    const fetchFn = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      respuestaJson({ items: [], page: 2, pageSize: 5, total: 0 }),
    );
    const api = createPagosApi({ baseUrl: "http://api.test", clienteId: "cliente-1", fetchFn });

    await api.listar({ page: 2, pageSize: 5, estado: "RECHAZADO", desde: "2026-10-01T00:00:00Z" });

    const [url, init] = fetchFn.mock.calls[0];
    expect(String(url)).toBe(
      "http://api.test/api/v1/pagos?page=2&pageSize=5&desde=2026-10-01T00%3A00%3A00Z&estado=RECHAZADO",
    );
    expect(init?.headers).toMatchObject({ "X-Cliente-Id": "cliente-1" });
  });

  it("given una respuesta 400 problem+json when lista then lanza PagosApiError con el detalle", async () => {
    const fetchFn = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      respuestaJson({ title: "Consulta inválida", detail: "El rango no puede superar 90 días." }, 400),
    );
    const api = createPagosApi({ baseUrl: "http://api.test", clienteId: "c", fetchFn });

    await expect(api.listar({ page: 1, pageSize: 10 })).rejects.toMatchObject({
      name: PagosApiError.name,
      status: 400,
      message: "El rango no puede superar 90 días.",
    });
  });
});
