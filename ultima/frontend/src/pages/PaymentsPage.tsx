import { useEffect, useState } from 'react';
import type { PaymentsApi } from '../api/paymentsClient';
import type { PagedPayments } from '../api/types';
import { Pagination } from '../components/molecules/Pagination';
import { PaymentFilters } from '../components/organisms/PaymentFilters';
import type { PaymentFilterValues } from '../components/organisms/PaymentFilters';
import { PaymentsTable } from '../components/organisms/PaymentsTable';
import { PageTemplate } from '../components/templates/PageTemplate';

const PAGE_SIZE = 10;
const NO_FILTERS: PaymentFilterValues = { from: '', to: '', status: '' };

type RemoteState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; data: PagedPayments };

export function PaymentsPage({ api }: { api: PaymentsApi }) {
  const [filters, setFilters] = useState<PaymentFilterValues>(NO_FILTERS);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<RemoteState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: 'loading' });
    api
      .list({ ...filters, page, pageSize: PAGE_SIZE })
      .then((data) => {
        if (!cancelled) setState({ kind: 'success', data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ kind: 'error', message: err instanceof Error ? err.message : 'Error inesperado.' });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [api, filters, page]);

  const applyFilters = (values: PaymentFilterValues) => {
    setPage(1);
    setFilters(values);
  };

  return (
    <PageTemplate title="Consulta de pagos">
      <PaymentFilters initial={NO_FILTERS} onSubmit={applyFilters} />
      <div aria-live="polite">
        {state.kind === 'loading' && <p role="status">Cargando pagos…</p>}
        {state.kind === 'error' && <p role="alert">{state.message}</p>}
      </div>
      {state.kind === 'success' && (
        <>
          <PaymentsTable payments={state.data.items} />
          <Pagination page={state.data.page} pageSize={state.data.pageSize} total={state.data.total} onChange={setPage} />
        </>
      )}
    </PageTemplate>
  );
}
