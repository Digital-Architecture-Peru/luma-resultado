import { PaymentForm } from '../components/organisms/PaymentForm';
import { PaymentSummary } from '../components/organisms/PaymentSummary';
import { PaymentTemplate } from '../components/templates/PaymentTemplate';
import { useAccounts } from '../hooks/useAccounts';
import { usePayment } from '../hooks/usePayment';
import { createHttpPaymentsApi } from '../services/paymentsApi';
import type { PaymentsApi } from '../services/paymentsApi';

const defaultApi = createHttpPaymentsApi((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '');

export function PaymentPage({ api = defaultApi }: { api?: PaymentsApi }) {
  const { accounts, loading, error: accountsError } = useAccounts(api);
  const { state, submit } = usePayment(api);

  return (
    <PaymentTemplate>
      {loading ? <p>Cargando cuentas…</p> : null}
      {accountsError ? <p role="alert">{accountsError}</p> : null}
      {!loading && !accountsError ? (
        <PaymentForm accounts={accounts} submitting={state.phase === 'submitting'} onSubmit={submit} />
      ) : null}
      {state.phase === 'error' ? <p role="alert">{state.error}</p> : null}
      {state.phase === 'success' && state.result ? <PaymentSummary result={state.result} /> : null}
    </PaymentTemplate>
  );
}
