import { useRef, useState } from 'react';
import { PaymentForm } from '../components/organisms/PaymentForm';
import { PaymentReceipt } from '../components/organisms/PaymentReceipt';
import { BankingLayout } from '../components/templates/BankingLayout';
import { httpPaymentsApi, type PaymentsApi } from '../services/paymentsApi';
import type { Payment, PaymentRequest } from '../types';

const DEMO_ACCOUNTS = ['ES00-FAKE-0001', 'ES00-FAKE-0002'] as const;

export function PaymentPage({ api = httpPaymentsApi }: { api?: PaymentsApi }) {
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);
  // La misma clave se reutiliza en reintentos; se renueva tras un envio correcto.
  const idempotencyKey = useRef<string>(crypto.randomUUID());

  async function handleSubmit(values: PaymentRequest) {
    setSubmitting(true);
    setError(null);
    try {
      const created = await api.create(values, idempotencyKey.current);
      setPayment(created);
      idempotencyKey.current = crypto.randomUUID();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BankingLayout title="Pagos">
      <PaymentForm accounts={DEMO_ACCOUNTS} submitting={submitting} onSubmit={(v) => void handleSubmit(v)} />
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {payment && <PaymentReceipt payment={payment} />}
    </BankingLayout>
  );
}
