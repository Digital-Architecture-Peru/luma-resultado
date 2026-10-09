import { PaymentForm } from '../components/organisms/PaymentForm';
import { PaymentResult } from '../components/organisms/PaymentResult';
import { PageTemplate } from '../components/templates/PageTemplate';
import { usePayment } from '../hooks/usePayment';

export function PaymentPage() {
  const { state, submit, reset } = usePayment();

  return (
    <PageTemplate title="Pago de servicios">
      {state.status === 'success' ? null : (
        <PaymentForm loading={state.status === 'loading'} onSubmit={submit} />
      )}
      <PaymentResult state={state} onNewPayment={reset} />
    </PageTemplate>
  );
}
