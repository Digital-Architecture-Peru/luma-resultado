import type { TarjetaDetalle, TarjetaResumen } from "../types/tarjeta";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface TarjetasApi {
  listar(): Promise<TarjetaResumen[]>;
  detalle(id: string): Promise<TarjetaDetalle>;
}

export interface ApiConfig {
  baseUrl: string;
  clienteId: string;
  fetchImpl?: typeof fetch;
}

export function crearTarjetasApi(config: ApiConfig): TarjetasApi {
  const base = config.baseUrl.replace(/\/+$/, "");
  const hacerFetch = config.fetchImpl ?? ((...args: Parameters<typeof fetch>) => fetch(...args));

  async function obtener<T>(ruta: string): Promise<T> {
    const respuesta = await hacerFetch(`${base}/api/v1/tarjetas${ruta}`, {
      headers: { Accept: "application/json", "X-Cliente-Id": config.clienteId },
    });
    if (!respuesta.ok) {
      throw new ApiError(respuesta.status, mensajeParaEstado(respuesta.status));
    }
    return (await respuesta.json()) as T;
  }

  return {
    listar: () => obtener<TarjetaResumen[]>(""),
    detalle: (id) => obtener<TarjetaDetalle>(`/${encodeURIComponent(id)}`),
  };
}

function mensajeParaEstado(status: number): string {
  if (status === 404) return "La tarjeta no existe o no está disponible.";
  if (status === 400) return "La solicitud no es válida.";
  return "No pudimos consultar tus tarjetas. Intenta nuevamente.";
}

export const tarjetasApi: TarjetasApi = crearTarjetasApi({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  clienteId: import.meta.env.VITE_CLIENTE_ID ?? "11111111-1111-1111-1111-111111111111",
});
