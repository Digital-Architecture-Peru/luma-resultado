import { describe, expect, it, vi } from 'vitest';
import { ApiError, listarCuentas, obtenerCuenta } from './cuentasApi';

function respuesta(status: number, cuerpo: unknown): Response {
  return new Response(JSON.stringify(cuerpo), { status });
}

describe('cuentasApi', () => {
  it('given ok response, when listarCuentas, then sends header and returns data', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respuesta(200, [{ id: 'c1' }]));
    const datos = await listarCuentas('cli-1', fetchFalso, 'http://api');
    expect(datos).toHaveLength(1);
    expect(fetchFalso).toHaveBeenCalledWith('http://api/api/v1/cuentas', {
      headers: { 'X-Cliente-Id': 'cli-1' },
    });
  });

  it('given 404 problem, when obtenerCuenta, then throws ApiError with title', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respuesta(404, { title: 'Cuenta no encontrada' }));
    await expect(obtenerCuenta('cli-1', 'x', fetchFalso, 'http://api')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Cuenta no encontrada',
    });
    expect(ApiError).toBeDefined();
  });
});
