import { describe, expect, it, vi } from 'vitest';
import { crearTarjetasApi } from './tarjetasApi';

describe('crearTarjetasApi', () => {
  it('given respuesta ok when listar then envía cabecera de cliente y devuelve la página', async () => {
    const pagina = { items: [], pagina: 0, tamano: 20, total: 0 };
    const fetchFn = vi.fn(async () => new Response(JSON.stringify(pagina), { status: 200 }));
    const api = crearTarjetasApi({ baseUrl: 'http://x', clienteId: 'abc', fetchFn: fetchFn as unknown as typeof fetch });

    const resultado = await api.listar();

    expect(resultado).toEqual(pagina);
    const llamada = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(llamada[0]).toBe('http://x/api/v1/tarjetas?pagina=0&tamano=20');
    expect((llamada[1].headers as Record<string, string>)['X-Cliente-Id']).toBe('abc');
  });

  it('given HTTP 500 when listar then rechaza con mensaje', async () => {
    const fetchFn = vi.fn(async () => new Response('{}', { status: 500 }));
    const api = crearTarjetasApi({ baseUrl: 'http://x', clienteId: 'abc', fetchFn: fetchFn as unknown as typeof fetch });

    await expect(api.listar()).rejects.toThrow('HTTP 500');
  });
});
