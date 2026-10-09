import type { Payment } from '../../types';
import { Amount } from '../atoms/Amount';

const STATUS_LABEL: Record<Payment['status'], string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
};

export function PaymentReceipt({ payment }: { payment: Payment }) {
  return (
    <section role="status" className="receipt" aria-label="Resultado del pago">
      <h2>Pago {STATUS_LABEL[payment.status]}</h2>
      <dl>
        <dt>Referencia</dt>
        <dd>{payment.id}</dd>
        <dt>Beneficiario</dt>
        <dd>{payment.beneficiary}</dd>
        <dt>Importe</dt>
        <dd>
          <Amount amount={payment.amount} currency={payment.currency} />
        </dd>
      </dl>
    </section>
  );
}
