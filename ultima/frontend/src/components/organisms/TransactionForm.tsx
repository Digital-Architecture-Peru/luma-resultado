import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NewTransaction, TransactionType } from '../../services/api';
import { Button } from '../atoms/Button';
import { StatusMessage } from '../atoms/StatusMessage';
import { FormField } from '../molecules/FormField';

interface Props {
  onSubmit: (tx: NewTransaction) => Promise<boolean>;
}

export function TransactionForm({ onSubmit }: Props) {
  const [type, setType] = useState<TransactionType>('PURCHASE');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [validation, setValidation] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setConfirmation(null);
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setValidation('Ingresa un monto mayor a cero');
      return;
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      setValidation('La moneda debe tener 3 letras mayúsculas (ISO 4217)');
      return;
    }
    setValidation(null);
    setSending(true);
    const ok = await onSubmit({ type, amount: Math.round(value * 100) / 100, currency, description: description.trim() });
    setSending(false);
    if (ok) {
      setConfirmation('Transacción registrada');
      setAmount('');
      setDescription('');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField id="tx-type" label="Tipo">
        <select id="tx-type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
          <option value="PURCHASE">Compra</option>
          <option value="PAYMENT">Pago</option>
          <option value="REFUND">Reembolso</option>
        </select>
      </FormField>
      <FormField id="tx-amount" label="Monto">
        <input id="tx-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </FormField>
      <FormField id="tx-currency" label="Moneda">
        <input id="tx-currency" maxLength={3} value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
      </FormField>
      <FormField id="tx-description" label="Descripción">
        <input id="tx-description" maxLength={120} value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormField>
      <Button type="submit" disabled={sending}>
        {sending ? 'Enviando…' : 'Registrar transacción'}
      </Button>
      {validation && <StatusMessage kind="error">{validation}</StatusMessage>}
      {confirmation && <StatusMessage kind="info">{confirmation}</StatusMessage>}
    </form>
  );
}
