import type { Cuenta } from '../types/cuenta';

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

async function leer<T>(url: string, clienteId: string, fetchImpl: FetchLike): Promise<T> {
  const respuesta = await fetchImpl(url, { headers: { 'X-Cliente-Id': clienteId } });
  if (!respuesta.ok) {
    let detalle = 'No se pudo completar la consulta.';
    try {
      const problema = (await respuesta.json()) as { title?: string };
      if (problema.title) detalle = problema.title;
    } catch {
      // cuerpo no JSON: se mantiene el mensaje genérico
    }
    throw new ApiError(detalle, respuesta.status);
  }
  return (await respuesta.json()) as T;
}

export function listarCuentas(
  clienteId: string,
  fetchImpl: FetchLike = (i, o) => fetch(i, o),
  baseUrl: string = BASE_URL,
): Promise<Cuenta[]> {
  return leer<Cuenta[]>(`${baseUrl}/api/v1/cuentas`, clienteId, fetchImpl);
}

export function obtenerCuenta(
  clienteId: string,
  id: string,
  fetchImpl: FetchLike = (i, o) => fetch(i, o),
  baseUrl: string = BASE_URL,
): Promise<Cuenta> {
  return leer<Cuenta>(`${baseUrl}/api/v1/cuentas/${encodeURIComponent(id)}`, clienteId, fetchImpl);
}
