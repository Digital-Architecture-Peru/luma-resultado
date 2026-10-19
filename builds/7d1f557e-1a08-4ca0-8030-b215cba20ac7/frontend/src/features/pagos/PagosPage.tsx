import { useEffect, useState } from 'react';
import type { FiltrosPagos, Pago, PagosApi, PagosPagina } from '../../api/pagosClient';
import { Filtros, type ValoresFiltro } from './Filtros';
import { PagoDetalle } from './PagoDetalle';
import { PagosList } from './PagosList';

const PAGE_SIZE = 10;

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'ok'; datos: PagosPagina };

function mensajeError(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo consultar los pagos.';
}

export function PagosPage({ api }: { api: PagosApi }) {
  const [filtros, setFiltros] = useState<FiltrosPagos>({ page: 1, pageSize: PAGE_SIZE });
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });
  const [detalle, setDetalle] = useState<Pago | null>(null);

  useEffect(() => {
    let activo = true;
    setEstado({ tipo: 'cargando' });
    api
      .listar(filtros)
      .then((datos) => activo && setEstado({ tipo: 'ok', datos }))
      .catch((error: unknown) => activo && setEstado({ tipo: 'error', mensaje: mensajeError(error) }));
    return () => {
      activo = false;
    };
  }, [api, filtros]);

  function aplicar(valores: ValoresFiltro) {
    setDetalle(null);
    setFiltros({ ...valores, page: 1, pageSize: PAGE_SIZE });
  }

  const cambiarPagina = (page: number) => setFiltros((f) => ({ ...f, page }));

  return (
    <>
      <Filtros onAplicar={aplicar} />
      {estado.tipo === 'cargando' && <p role="status">Cargando pagos…</p>}
      {estado.tipo === 'error' && <p role="alert">{estado.mensaje}</p>}
      {estado.tipo === 'ok' && (
        <>
          <PagosList pagos={estado.datos.items} onSeleccionar={setDetalle} />
          <nav className="paginacion" aria-label="Paginación">
            <button type="button" disabled={estado.datos.page <= 1} onClick={() => cambiarPagina(estado.datos.page - 1)}>
              Anterior
            </button>
            <span>
              Página {estado.datos.page} · {estado.datos.total} pagos
            </span>
            <button
              type="button"
              disabled={estado.datos.page * estado.datos.pageSize >= estado.datos.total}
              onClick={() => cambiarPagina(estado.datos.page + 1)}
            >
              Siguiente
            </button>
          </nav>
        </>
      )}
      {detalle && <PagoDetalle pago={detalle} onCerrar={() => setDetalle(null)} />}
    </>
  );
}
