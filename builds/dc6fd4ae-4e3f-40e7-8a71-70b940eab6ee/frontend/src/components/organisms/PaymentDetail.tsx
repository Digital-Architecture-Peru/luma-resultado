import { Button } from '../atoms/Button';
import { StatusBadge } from '../atoms/StatusBadge';
import { formatAmount, formatDate } from '../../services/format';
import type { Payment } from '../../types';

interface PaymentDetailProps {
  payment: Payment;
  onClose: () => void;
}

export function PaymentDetail({ payment, onClose }: PaymentDetailProps) {
  return (
    <section className="detail" aria-label="Detalle del pago">
      <h2>Pago {payment.reference}</h2>
      <dl>
        <dt>Beneficiario</dt>
        <dd>{payment.beneficiaryName}</dd>
        <dt>Cuenta</dt>
        <dd>{payment.beneficiaryAccountMasked}</dd>
        <dt>Monto</dt>
        <dd>{formatAmount(payment.amount, payment.currency)}</dd>
        <dt>Estado</dt>
        <dd>
          <StatusBadge status={payment.status} />
        </dd>
        <dt>Ejecutado</dt>
        <dd>{formatDate(payment.executedAt)}</dd>
      </dl>
      <Button variant="secondary" onClick={onClose}>
        Cerrar detalle
      </Button>
    </section>
  );
}
