import { describe, expect, it, vi } from 'vitest';
import { construirQuery, crearBuscarPagos } from './pagosApi';

const sinFiltros = { desde: '', hasta: '', estado: '' } as const;

describe('pagosApi', () => {
  it('given filtros completos when construirQuery then incluye solo los informados', () => {
    expect(construirQuery({ desde: '2026-09-01', hasta: '', estado: 'PENDIENTE' }, 1, 10)).toBe(
      'page=1&size=10&desde=2026-09-01&estado=PENDIENTE',
    );
  });

  it('given respuesta correcta when buscar then devuelve la página', async () => {
    const pagina = { contenido: [], page: 0, size: 20, total: 0 };
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify(pagina), { status: 200 }));

    const resultado = await crearBuscarPagos(fakeFetch as unknown as typeof fetch)(sinFiltros, 0, 20);

    expect(resultado).toEqual(pagina);
  });

  it('given error 400 problem+json when buscar then lanza el detalle', async () => {
    const fakeFetch = vi.fn(
      async () => new Response(JSON.stringify({ detail: "'size' inválido" }), { status: 400 }),
    );

    await expect(
      crearBuscarPagos(fakeFetch as unknown as typeof fetch)(sinFiltros, 0, 500),
    ).rejects.toThrow("'size' inválido");
  });
});
