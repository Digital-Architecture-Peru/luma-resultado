import type { FiltroPagos, PagedResult, Pago } from "../types/pago";

export class PagosApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PagosApiError";
    this.status = status;
  }
}

export interface PagosApi {
  listar(filtro: FiltroPagos, signal?: AbortSignal): Promise<PagedResult<Pago>>;
  obtener(id: string, signal?: AbortSignal): Promise<Pago>;
}

export interface PagosApiConfig {
  baseUrl: string;
  clienteId: string;
  fetchFn?: typeof fetch;
}

async function leerDetalleError(respuesta: Response): Promise<string> {
  try {
    const problema = (await respuesta.json()) as { detail?: string; title?: string };
    return problema.detail ?? problema.title ?? `Error ${respuesta.status}`;
  } catch {
    return `Error ${respuesta.status}`;
  }
}

export function createPagosApi({ baseUrl, clienteId, fetchFn }: PagosApiConfig): PagosApi {
  const llamar = fetchFn ?? ((input: RequestInfo | URL, init?: RequestInit) => fetch(input, init));

  async function pedir<T>(ruta: string, signal?: AbortSignal): Promise<T> {
    const respuesta = await llamar(`${baseUrl}${ruta}`, {
      method: "GET",
      headers: { Accept: "application/json", "X-Cliente-Id": clienteId },
      signal,
    });
    if (!respuesta.ok) {
      throw new PagosApiError(await leerDetalleError(respuesta), respuesta.status);
    }
    return (await respuesta.json()) as T;
  }

  return {
    listar(filtro, signal) {
      const query = new URLSearchParams({ page: String(filtro.page), pageSize: String(filtro.pageSize) });
      if (filtro.desde) query.set("desde", filtro.desde);
      if (filtro.hasta) query.set("hasta", filtro.hasta);
      if (filtro.estado) query.set("estado", filtro.estado);
      return pedir<PagedResult<Pago>>(`/api/v1/pagos?${query.toString()}`, signal);
    },
    obtener(id, signal) {
      return pedir<Pago>(`/api/v1/pagos/${encodeURIComponent(id)}`, signal);
    },
  };
}
