import type { PaymentResult, PaymentStatus } from '../../types';

const STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
};

export function PaymentSummary({ result }: { result: PaymentResult }) {
  return (
    <section className="summary" role="status" aria-label="Resumen del pago">
      <h2>Pago {STATUS_LABEL[result.status].toLowerCase()}</h2>
      <dl>
        <dt>Comprobante</dt>
        <dd>{result.id}</dd>
        <dt>Beneficiario</dt>
        <dd>{result.beneficiaryAccount}</dd>
        <dt>Monto</dt>
        <dd>
          {result.amount.toFixed(2)} {result.currency}
        </dd>
        <dt>Estado</dt>
        <dd>{STATUS_LABEL[result.status]}</dd>
      </dl>
    </section>
  );
}
