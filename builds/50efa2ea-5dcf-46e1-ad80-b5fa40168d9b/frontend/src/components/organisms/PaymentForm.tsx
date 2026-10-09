import { FormEvent, useState } from 'react';
import type { PaymentRequest } from '../../types';
import { Button } from '../atoms/Button';
import { AccountSelect } from '../molecules/AccountSelect';
import { FormField } from '../molecules/FormField';

const AMOUNT_PATTERN = /^\d{1,17}(\.\d{1,2})?$/;
export const CURRENCY = 'EUR';

export type FormErrors = Partial<Record<'beneficiary' | 'amount' | 'reference', string>>;

export function validate(values: PaymentRequest): FormErrors {
  const errors: FormErrors = {};
  if (!values.beneficiary.trim()) {
    errors.beneficiary = 'El beneficiario es obligatorio';
  } else if (values.beneficiary === values.sourceAccount) {
    errors.beneficiary = 'El beneficiario no puede ser la cuenta origen';
  }
  if (!AMOUNT_PATTERN.test(values.amount) || Number(values.amount) <= 0) {
    errors.amount = 'Introduce un importe mayor que 0 con hasta 2 decimales';
  }
  if (values.reference.length > 140) {
    errors.reference = 'Maximo 140 caracteres';
  }
  return errors;
}

interface PaymentFormProps {
  accounts: readonly string[];
  submitting: boolean;
  onSubmit: (values: PaymentRequest) => void;
}

export function PaymentForm({ accounts, submitting, onSubmit }: PaymentFormProps) {
  const [sourceAccount, setSourceAccount] = useState(accounts[0] ?? '');
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values: PaymentRequest = {
      sourceAccount,
      beneficiary: beneficiary.trim(),
      amount: amount.trim(),
      currency: CURRENCY,
      reference: reference.trim(),
    };
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onSubmit(values);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulario de pago">
      <AccountSelect id="source" label="Cuenta origen" accounts={accounts} value={sourceAccount} onChange={setSourceAccount} />
      <FormField id="beneficiary" label="Beneficiario" value={beneficiary} error={errors.beneficiary}
        maxLength={34} onChange={(e) => setBeneficiary(e.target.value)} />
      <FormField id="amount" label={`Importe (${CURRENCY})`} value={amount} error={errors.amount}
        inputMode="decimal" onChange={(e) => setAmount(e.target.value)} />
      <FormField id="reference" label="Concepto" value={reference} error={errors.reference}
        onChange={(e) => setReference(e.target.value)} />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Pagar'}
      </Button>
    </form>
  );
}
