import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Account, PaymentRequest } from '../../types';
import { isPositiveAmount } from '../../utils/amount';
import { AmountInput } from '../atoms/AmountInput';
import { Button } from '../atoms/Button';
import { TextInput } from '../atoms/TextInput';
import { AccountSelector } from '../molecules/AccountSelector';
import { FormField } from '../molecules/FormField';

interface PaymentFormProps {
  accounts: Account[];
  submitting: boolean;
  onSubmit: (request: PaymentRequest) => void;
}

type Errors = Partial<Record<'beneficiary' | 'amount' | 'reference', string>>;

const BENEFICIARY_PATTERN = /^[A-Za-z0-9]{8,20}$/;
const MAX_REFERENCE = 140;

function validate(beneficiary: string, amount: string, reference: string): Errors {
  const errors: Errors = {};
  if (!BENEFICIARY_PATTERN.test(beneficiary)) errors.beneficiary = 'Ingrese 8 a 20 caracteres alfanuméricos.';
  if (!isPositiveAmount(amount)) errors.amount = 'Ingrese un monto mayor que 0 (máximo 2 decimales).';
  if (reference.length > MAX_REFERENCE) errors.reference = `Máximo ${MAX_REFERENCE} caracteres.`;
  return errors;
}

export function PaymentForm({ accounts, submitting, onSubmit }: PaymentFormProps) {
  const [sourceId, setSourceId] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const selected = accounts.find((a) => a.id === sourceId) ?? accounts[0];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (submitting || !selected) return;
    const found = validate(beneficiary.trim(), amount, reference.trim());
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      sourceAccountId: selected.id,
      beneficiaryAccount: beneficiary.trim(),
      amount,
      currency: selected.currency,
      reference: reference.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulario de pago">
      <FormField id="source" label="Cuenta origen">
        <AccountSelector id="source" accounts={accounts} value={selected?.id ?? ''} onChange={setSourceId} />
      </FormField>
      <FormField id="beneficiary" label="Cuenta beneficiaria" error={errors.beneficiary}>
        <TextInput
          id="beneficiary"
          value={beneficiary}
          autoComplete="off"
          aria-invalid={errors.beneficiary ? true : undefined}
          aria-describedby={errors.beneficiary ? 'beneficiary-error' : undefined}
          onChange={(e) => setBeneficiary(e.target.value)}
        />
      </FormField>
      <FormField id="amount" label="Monto" error={errors.amount}>
        <AmountInput
          id="amount"
          value={amount}
          onChange={setAmount}
          invalid={Boolean(errors.amount)}
          describedBy={errors.amount ? 'amount-error' : undefined}
        />
      </FormField>
      <FormField id="reference" label="Referencia" error={errors.reference}>
        <TextInput id="reference" value={reference} onChange={(e) => setReference(e.target.value)} />
      </FormField>
      <Button type="submit" disabled={submitting || !selected}>
        {submitting ? 'Procesando…' : 'Pagar'}
      </Button>
    </form>
  );
}
