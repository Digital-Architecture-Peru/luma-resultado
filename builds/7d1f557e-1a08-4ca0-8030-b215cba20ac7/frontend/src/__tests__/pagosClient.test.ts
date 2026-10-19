import { describe, expect, it, vi } from 'vitest';
import { ApiError, construirQuery, crearPagosClient } from '../api/pagosClient';

function respuestaJson(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

describe('construirQuery', () => {
  it('given filtros completos when construye then incluye solo los definidos', () => {
    const query = construirQuery({ estado: 'APLICADO', page: 2, pageSize: 10 });
    expect(query).toBe('estado=APLICADO&page=2&pageSize=10');
  });
});

describe('crearPagosClient', () => {
  it('given base con barra final when lista then llama a /api/v1/pagos con la query', async () => {
    const fetchMock = vi.fn(async () => respuestaJson({ items: [], total: 0, page: 1, pageSize: 10 }));
    const cliente = crearPagosClient('http://api.test/', fetchMock as unknown as typeof fetch);

    const pagina = await cliente.listar({ page: 1, pageSize: 10 });

    expect(pagina.total).toBe(0);
    const url = (fetchMock.mock.calls[0] as unknown[])[0];
    expect(url).toBe('http://api.test/api/v1/pagos?page=1&pageSize=10');
  });

  it('given error problem+json when lista then lanza ApiError con el detalle', async () => {
    const fetchMock = vi.fn(async () => respuestaJson({ detail: 'pageSize inválido' }, 400));
    const cliente = crearPagosClient('http://api.test', fetchMock as unknown as typeof fetch);

    await expect(cliente.listar({ page: 1, pageSize: 99 })).rejects.toMatchObject({
      status: 400,
      message: 'pageSize inválido'
    });
    await expect(cliente.listar({ page: 1, pageSize: 99 })).rejects.toBeInstanceOf(ApiError);
  });

  it('given id con caracteres especiales when obtiene then lo codifica en la URL', async () => {
    const fetchMock = vi.fn(async () => respuestaJson({ id: 'a/b' }));
    const cliente = crearPagosClient('http://api.test', fetchMock as unknown as typeof fetch);

    await cliente.obtener('a/b');

    const url = (fetchMock.mock.calls[0] as unknown[])[0];
    expect(url).toBe('http://api.test/api/v1/pagos/a%2Fb');
  });
});
