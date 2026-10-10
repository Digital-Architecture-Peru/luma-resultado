import { describe, expect, it, vi } from 'vitest';
import { ApiError, crearNotificacionesApi } from './notificacionesApi';

function respuestaJson(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('notificacionesApi', () => {
  it('given filtro leida=false, when listar, then construye la URL con parámetros', async () => {
    const fetchFn = vi.fn().mockResolvedValue(respuestaJson({ contenido: [], page: 0, size: 20, total: 0 }));
    const api = crearNotificacionesApi('http://api', fetchFn);

    await api.listar('0011223344', { leida: false });

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn.mock.calls[0][0]).toBe(
      'http://api/api/v1/cuentas/0011223344/notificaciones?leida=false&page=0&size=20',
    );
  });

  it('given un id, when marcarLeida, then usa PATCH sobre /lectura', async () => {
    const fetchFn = vi.fn().mockResolvedValue(respuestaJson({ id: 'n-1', leida: true }));
    const api = crearNotificacionesApi('', fetchFn);

    await api.marcarLeida('n-1');

    expect(fetchFn.mock.calls[0][0]).toBe('/api/v1/notificaciones/n-1/lectura');
    expect(fetchFn.mock.calls[0][1]).toMatchObject({ method: 'PATCH' });
  });

  it('given una preferencia, when guardarPreferencia, then envía PUT con JSON', async () => {
    const preferencia = { tipo: 'CARGO', canal: 'SMS', activo: true, umbralMonto: 5 } as const;
    const fetchFn = vi.fn().mockResolvedValue(respuestaJson(preferencia));
    const api = crearNotificacionesApi('', fetchFn);

    await api.guardarPreferencia('0011223344', preferencia);

    const init = fetchFn.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body as string)).toEqual(preferencia);
  });

  it('given problem+json 403, when listar, then lanza ApiError con el detalle', async () => {
    const fetchFn = vi.fn().mockResolvedValue(respuestaJson({ detail: 'No tiene acceso' }, 403));
    const api = crearNotificacionesApi('', fetchFn);

    await expect(api.listar('1')).rejects.toMatchObject({ name: 'ApiError', status: 403, message: 'No tiene acceso' });
    await expect(api.listar('1')).rejects.toBeInstanceOf(ApiError);
  });

  it('given una respuesta de error sin JSON, when listar, then usa mensaje genérico', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('boom', { status: 500 }));
    const api = crearNotificacionesApi('', fetchFn);

    await expect(api.listar('1')).rejects.toMatchObject({ status: 500, message: 'No se pudo completar la operación' });
  });
});
