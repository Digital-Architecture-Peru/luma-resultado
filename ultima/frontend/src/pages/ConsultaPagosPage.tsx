import { useCallback, useEffect, useState } from 'react';
import { ConsultaLayout } from '../components/templates/ConsultaLayout';
import { FiltersPanel } from '../components/organisms/FiltersPanel';
import { PaymentsTable } from '../components/organisms/PaymentsTable';
import { Pager } from '../components/molecules/Pager';
import { buscarPagos } from '../services/pagosApi';
import type { BuscarPagos, FiltrosPagos, Pagina, Pago } from '../types/pagos';

const TAMANO_PAGINA = 10;
const FILTROS_INICIALES: FiltrosPagos = { desde: '', hasta: '', estado: '' };

type Resultado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'exito'; pagina: Pagina<Pago> };

interface ConsultaPagosPageProps {
  api?: BuscarPagos;
}

export function ConsultaPagosPage({ api = buscarPagos }: ConsultaPagosPageProps) {
  const [borrador, setBorrador] = useState<FiltrosPagos>(FILTROS_INICIALES);
  const [aplicados, setAplicados] = useState<FiltrosPagos>(FILTROS_INICIALES);
  const [page, setPage] = useState(0);
  const [resultado, setResultado] = useState<Resultado>({ tipo: 'cargando' });

  useEffect(() => {
    let vigente = true;
    setResultado({ tipo: 'cargando' });
    api(aplicados, page, TAMANO_PAGINA)
      .then((pagina) => vigente && setResultado({ tipo: 'exito', pagina }))
      .catch((error: unknown) => {
        if (!vigente) return;
        const mensaje = error instanceof Error ? error.message : 'Error desconocido';
        setResultado({ tipo: 'error', mensaje });
      });
    return () => {
      vigente = false;
    };
  }, [api, aplicados, page]);

  const consultar = useCallback(() => {
    setPage(0);
    setAplicados(borrador);
  }, [borrador]);

  return (
    <ConsultaLayout
      titulo="Consulta de pagos"
      filtros={
        <FiltersPanel
          filtros={borrador}
          disabled={resultado.tipo === 'cargando'}
          onChange={setBorrador}
          onSubmit={consultar}
        />
      }
    >
      {resultado.tipo === 'cargando' && (
        <p role="status" className="muted">
          Cargando pagos…
        </p>
      )}
      {resultado.tipo === 'error' && <p role="alert" className="error">{resultado.mensaje}</p>}
      {resultado.tipo === 'exito' && (
        <>
          <PaymentsTable pagos={resultado.pagina.contenido} />
          <Pager
            page={resultado.pagina.page}
            size={resultado.pagina.size}
            total={resultado.pagina.total}
            onPageChange={setPage}
          />
        </>
      )}
    </ConsultaLayout>
  );
}
