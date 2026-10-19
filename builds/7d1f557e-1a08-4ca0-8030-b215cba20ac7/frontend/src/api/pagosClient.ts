export type EstadoPago = 'PENDIENTE' | 'APLICADO' | 'RECHAZADO';

export interface Pago {
  id: string;
  referencia: string;
  beneficiario: string;
  cuentaDestinoMask: string;
  /** Decimal serializado como texto para no perder precisión. */
  monto: string;
  moneda: string;
  estado: EstadoPago;
  fechaPago: string;
  canal: string;
}

export interface PagosPagina {
  items: Pago[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FiltrosPagos {
  /** ISO 8601 */
  desde?: string;
  /** ISO 8601 */
  hasta?: string;
  estado?: EstadoPago;
  page: number;
  pageSize: number;
}

export interface PagosApi {
  listar(filtros: FiltrosPagos): Promise<PagosPagina>;
  obtener(id: string): Promise<Pago>;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function construirQuery(filtros: FiltrosPagos): string {
  const params = new URLSearchParams();
  if (filtros.desde) params.set('desde', filtros.desde);
  if (filtros.hasta) params.set('hasta', filtros.hasta);
  if (filtros.estado) params.set('estado', filtros.estado);
  params.set('page', String(filtros.page));
  params.set('pageSize', String(filtros.pageSize));
  return params.toString();
}

async function leerRespuesta<T>(respuesta: Response): Promise<T> {
  if (respuesta.ok) return (await respuesta.json()) as T;
  let detalle = `Error ${respuesta.status}`;
  try {
    const problema = (await respuesta.json()) as { detail?: string; title?: string };
    detalle = problema.detail ?? problema.title ?? detalle;
  } catch {
    // Cuerpo no JSON: se conserva el mensaje genérico.
  }
  throw new ApiError(respuesta.status, detalle);
}

export function crearPagosClient(
  baseUrl: string,
  fetchFn: typeof fetch = (input, init) => fetch(input, init)
): PagosApi {
  const base = baseUrl.replace(/\/+$/, '');
  return {
    async listar(filtros) {
      const respuesta = await fetchFn(`${base}/api/v1/pagos?${construirQuery(filtros)}`);
      return leerRespuesta<PagosPagina>(respuesta);
    },
    async obtener(id) {
      const respuesta = await fetchFn(`${base}/api/v1/pagos/${encodeURIComponent(id)}`);
      return leerRespuesta<Pago>(respuesta);
    }
  };
}
