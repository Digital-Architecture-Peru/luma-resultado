import type { Notificacion, OpcionesListado, Pagina, Preferencia } from '../types/notificacion';

export interface NotificacionesApi {
  listar(cuentaId: string, opciones?: OpcionesListado): Promise<Pagina<Notificacion>>;
  marcarLeida(id: string): Promise<Notificacion>;
  obtenerPreferencias(cuentaId: string): Promise<Preferencia[]>;
  guardarPreferencia(cuentaId: string, preferencia: Preferencia): Promise<Preferencia>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

const MENSAJE_GENERICO = 'No se pudo completar la operación';

async function leerError(respuesta: Response): Promise<ApiError> {
  try {
    const problema = (await respuesta.json()) as { detail?: string };
    return new ApiError(problema.detail ?? MENSAJE_GENERICO, respuesta.status);
  } catch {
    return new ApiError(MENSAJE_GENERICO, respuesta.status);
  }
}

export function crearNotificacionesApi(
  baseUrl: string,
  fetchFn: FetchFn = (input, init) => fetch(input, init),
): NotificacionesApi {
  async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
    const respuesta = await fetchFn(`${baseUrl}/api/v1${ruta}`, {
      ...init,
      headers: { Accept: 'application/json', ...(init?.headers ?? {}) },
    });
    if (!respuesta.ok) {
      throw await leerError(respuesta);
    }
    return (await respuesta.json()) as T;
  }

  const cuenta = (cuentaId: string) => encodeURIComponent(cuentaId);

  return {
    listar(cuentaId, opciones = {}) {
      const params = new URLSearchParams();
      if (opciones.leida !== undefined) params.set('leida', String(opciones.leida));
      params.set('page', String(opciones.page ?? 0));
      params.set('size', String(opciones.size ?? 20));
      return pedir(`/cuentas/${cuenta(cuentaId)}/notificaciones?${params.toString()}`);
    },
    marcarLeida(id) {
      return pedir(`/notificaciones/${encodeURIComponent(id)}/lectura`, { method: 'PATCH' });
    },
    obtenerPreferencias(cuentaId) {
      return pedir(`/cuentas/${cuenta(cuentaId)}/preferencias-notificacion`);
    },
    guardarPreferencia(cuentaId, preferencia) {
      return pedir(`/cuentas/${cuenta(cuentaId)}/preferencias-notificacion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferencia),
      });
    },
  };
}
