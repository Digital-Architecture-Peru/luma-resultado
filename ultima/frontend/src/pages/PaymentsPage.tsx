import { useCallback, useEffect, useState } from 'react';
import { FilterBar } from '../components/molecules/FilterBar';
import { PaymentDetail } from '../components/organisms/PaymentDetail';
import { PaymentsTable } from '../components/organisms/PaymentsTable';
import { PaymentsTemplate } from '../components/templates/PaymentsTemplate';
import type { PaymentsApi } from '../services/paymentsApi';
import type { PageResult, Payment, PaymentFilters } from '../types';

type RemoteState = 'idle' | 'loading' | 'success' | 'error';

const PAGE_SIZE = 20;

export function PaymentsPage({ api }: { api: PaymentsApi }) {
  const [filters, setFilters] = useState<PaymentFilters>({ page: 0, size: PAGE_SIZE });
  const [state, setState] = useState<RemoteState>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<PageResult<Payment> | null>(null);
  const [selected, setSelected] = useState<Payment | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    api
      .list(filters)
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        setState('success');
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Error desconocido');
        setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [api, filters]);

  const search = useCallback((next: PaymentFilters) => {
    setSelected(null);
    setFilters({ ...next, size: PAGE_SIZE });
  }, []);

  const select = useCallback(
    (id: string) => {
      api
        .get(id)
        .then(setSelected)
        .catch((e: unknown) => {
          setError(e instanceof Error ? e.message : 'Error desconocido');
          setState('error');
        });
    },
    [api],
  );

  const page = filters.page ?? 0;
  const total = result?.total ?? 0;
  const hasPrev = page > 0;
  const hasNext = (page + 1) * PAGE_SIZE < total;

  const statusText =
    state === 'loading'
      ? 'Cargando pagos…'
      : state === 'error'
        ? `No se pudo completar la consulta: ${error}`
        : state === 'success'
          ? `${total} pago(s) encontrados`
          : '';

  return (
    <PaymentsTemplate
      filters={<FilterBar onSearch={search} disabled={state === 'loading'} />}
      status={statusText}
      list={
        <>
          {result && state !== 'error' && <PaymentsTable payments={result.items} onSelect={select} />}
          <nav className="pager" aria-label="Paginación">
            <button type="button" className="btn btn--secondary" disabled={!hasPrev}
              onClick={() => setFilters({ ...filters, page: page - 1 })}>
              Anterior
            </button>
            <span>Página {page + 1}</span>
            <button type="button" className="btn btn--secondary" disabled={!hasNext}
              onClick={() => setFilters({ ...filters, page: page + 1 })}>
              Siguiente
            </button>
          </nav>
        </>
      }
      detail={selected && <PaymentDetail payment={selected} onClose={() => setSelected(null)} />}
    />
  );
}
