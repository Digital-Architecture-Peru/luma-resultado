import { useState } from 'react';
import type { FormEvent } from 'react';
import { formatMoney, validateAmount } from '../../domain/amount';
import type { Account, Card } from '../../types';
import { Button } from '../atoms/Button';
import { TextInput } from '../atoms/TextInput';
import { FormField } from '../molecules/FormField';

interface PaymentFormProps {
  card: Card;
  accounts: Account[];
  onSubmit: (accountId: string, amount: string) => Promise<void>;
}

type Feedback = { kind: 'idle' } | { kind: 'success' | 'error'; message: string };

/** Organismo: formulario de pago de tarjeta. */
export function PaymentForm({ card, accounts, onSubmit }: PaymentFormProps) {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'idle' });
  const [submitting, setSubmitting] = useState(false);

  const effectiveAccountId = accountId || accounts[0]?.id || '';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateAmount(amount, card.balance);
    setFieldError(error);
    if (error) return;
    if (!effectiveAccountId) {
      setFeedback({ kind: 'error', message: 'Seleccione una cuenta de origen' });
      return;
    }

    setSubmitting(true);
    setFeedback({ kind: 'idle' });
    try {
      await onSubmit(effectiveAccountId, amount.trim());
      setFeedback({ kind: 'success', message: `Pago de ${formatMoney(amount)} registrado correctamente` });
      setAmount('');
    } catch (e) {
      setFeedback({ kind: 'error', message: e instanceof Error ? e.message : 'No se pudo registrar el pago' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h2>Pagar tarjeta •••• {card.last4}</h2>
      <FormField id="source-account" label="Cuenta de origen">
        <select
          id="source-account"
          className="input"
          value={effectiveAccountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.alias} ({formatMoney(a.balance)})
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="amount" label="Monto a pagar" error={fieldError}>
        <TextInput
          id="amount"
          inputMode="decimal"
          value={amount}
          aria-invalid={fieldError !== null}
          aria-describedby={fieldError ? 'amount-error' : undefined}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormField>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Procesando…' : 'Pagar'}
      </Button>
      {feedback.kind === 'success' ? (
        <p className="feedback feedback--success" role="status">
          {feedback.message}
        </p>
      ) : null}
      {feedback.kind === 'error' ? (
        <p className="feedback feedback--error" role="alert">
          {feedback.message}
        </p>
      ) : null}
    </form>
  );
}
