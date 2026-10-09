import { useState } from 'react';
import type { FormEvent } from 'react';
import { DEFAULT_CURRENCY, parseAmount } from '../../domain/types';
import type { Card } from '../../domain/types';
import { Button } from '../atoms/Button';
import { SelectField } from '../molecules/SelectField';
import { TextField } from '../molecules/TextField';

interface PaymentFormProps {
  cards: Card[];
  selectedCardId: string;
  busy: boolean;
  onCardChange: (cardId: string) => void;
  onSubmit: (amount: number) => void;
}

export function PaymentForm({ cards, selectedCardId, busy, onCardChange, onSubmit }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = parseAmount(amount);
    if ('error' in parsed) {
      setError(parsed.error);
      return;
    }
    setError(undefined);
    onSubmit(parsed.value);
  };

  const options = cards.map((card) => ({ value: card.id, label: `${card.holderAlias} · ${card.maskedPan}` }));

  return (
    <form className="card" onSubmit={handleSubmit} noValidate aria-label="Pago de tarjeta">
      <SelectField label="Tarjeta" value={selectedCardId} options={options} onChange={onCardChange} />
      <TextField
        label={`Importe (${DEFAULT_CURRENCY})`}
        inputMode="decimal"
        autoComplete="off"
        value={amount}
        error={error}
        onChange={(event) => setAmount(event.target.value)}
      />
      <Button type="submit" disabled={busy || cards.length === 0}>
        {busy ? 'Procesando…' : 'Pagar'}
      </Button>
    </form>
  );
}
