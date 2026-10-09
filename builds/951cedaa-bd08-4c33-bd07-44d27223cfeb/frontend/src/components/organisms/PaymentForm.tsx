import { useState, type FormEvent } from 'react';
import { CURRENCIES, type Currency, type PaymentFormErrors, type PaymentFormValues, type PaymentRequest } from '../../types';
import { toPaymentRequest, validatePayment } from '../../validation';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { FormField } from '../molecules/FormField';

interface PaymentFormProps {
  loading: boolean;
  onSubmit: (request: PaymentRequest) => void;
}

const EMPTY: PaymentFormValues = {
  originAccount: '',
  beneficiary: '',
  amount: '',
  currency: 'PEN',
  concept: '',
};

export function PaymentForm({ loading, onSubmit }: PaymentFormProps) {
  const [values, setValues] = useState<PaymentFormValues>(EMPTY);
  const [errors, setErrors] = useState<PaymentFormErrors>({});

  const update = (field: keyof PaymentFormValues, value: string) =>
    setValues((current) => ({ ...current, [field]: field === 'currency' ? (value as Currency) : value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validatePayment(values);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onSubmit(toPaymentRequest(values));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulario de pago">
      <FormField id="originAccount" label="Cuenta de origen" error={errors.originAccount}>
        <Input
          id="originAccount"
          inputMode="numeric"
          autoComplete="off"
          value={values.originAccount}
          aria-invalid={Boolean(errors.originAccount)}
          aria-describedby={errors.originAccount ? 'originAccount-error' : undefined}
          onChange={(e) => update('originAccount', e.target.value)}
        />
      </FormField>
      <FormField id="beneficiary" label="Beneficiario" error={errors.beneficiary}>
        <Input
          id="beneficiary"
          value={values.beneficiary}
          aria-invalid={Boolean(errors.beneficiary)}
          aria-describedby={errors.beneficiary ? 'beneficiary-error' : undefined}
          onChange={(e) => update('beneficiary', e.target.value)}
        />
      </FormField>
      <FormField id="amount" label="Importe" error={errors.amount}>
        <Input
          id="amount"
          inputMode="decimal"
          value={values.amount}
          aria-invalid={Boolean(errors.amount)}
          aria-describedby={errors.amount ? 'amount-error' : undefined}
          onChange={(e) => update('amount', e.target.value)}
        />
      </FormField>
      <FormField id="currency" label="Moneda">
        <Select
          id="currency"
          options={CURRENCIES}
          value={values.currency}
          onChange={(e) => update('currency', e.target.value)}
        />
      </FormField>
      <FormField id="concept" label="Concepto" error={errors.concept}>
        <Input
          id="concept"
          value={values.concept}
          aria-invalid={Boolean(errors.concept)}
          aria-describedby={errors.concept ? 'concept-error' : undefined}
          onChange={(e) => update('concept', e.target.value)}
        />
      </FormField>
      <Button type="submit" disabled={loading}>
        {loading ? 'Procesando...' : 'Pagar'}
      </Button>
    </form>
  );
}
