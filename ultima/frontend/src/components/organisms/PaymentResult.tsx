import type { PaymentState } from '../../hooks/usePayment';
import { Button } from '../atoms/Button';

interface PaymentResultProps {
  state: PaymentState;
  onNewPayment: () => void;
}

export function PaymentResult({ state, onNewPayment }: PaymentResultProps) {
  if (state.status === 'idle' || state.status === 'loading') {
    return <div role="status" aria-live="polite" />;
  }
  if (state.status === 'error') {
    return (
      <div role="alert" className="result result-error">
        {state.message}
      </div>
    );
  }
  const { payment } = state;
  const confirmed = payment.status === 'CONFIRMADO';
  return (
    <div role="status" className={`result ${confirmed ? 'result-ok' : 'result-error'}`}>
      <p>
        {confirmed ? 'Pago confirmado' : `Pago ${payment.status.toLowerCase()}`}: {payment.amount} {payment.currency} a{' '}
        {payment.beneficiary}
      </p>
      <p>Operacion: {payment.id}</p>
      <Button type="button" onClick={onNewPayment}>
        Nuevo pago
      </Button>
    </div>
  );
}
