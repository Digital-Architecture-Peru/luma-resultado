import type { BuscarPagos, FiltrosPagos, Pagina, Pago } from '../types/pagos';

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';

export function construirQuery(filtros: FiltrosPagos, page: number, size: number): string {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (filtros.desde) params.set('desde', filtros.desde);
  if (filtros.hasta) params.set('hasta', filtros.hasta);
  if (filtros.estado) params.set('estado', filtros.estado);
  return params.toString();
}

async function leerDetalleError(respuesta: Response): Promise<string> {
  try {
    const cuerpo = (await respuesta.json()) as { detail?: string };
    if (cuerpo.detail) return cuerpo.detail;
  } catch {
    // El cuerpo no es JSON; se usa el mensaje genérico.
  }
  return `Error ${respuesta.status} al consultar los pagos`;
}

export function crearBuscarPagos(fetchImpl: typeof fetch = fetch): BuscarPagos {
  return async (filtros, page, size) => {
    const respuesta = await fetchImpl(`${BASE_URL}/api/v1/pagos?${construirQuery(filtros, page, size)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!respuesta.ok) {
      throw new Error(await leerDetalleError(respuesta));
    }
    return (await respuesta.json()) as Pagina<Pago>;
  };
}

export const buscarPagos: BuscarPagos = (filtros, page, size) => crearBuscarPagos()(filtros, page, size);
