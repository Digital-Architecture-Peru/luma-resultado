import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Account, TransferFormErrors, TransferFormValues, TransferRequest } from '../../domain/types';
import { MAX_DESCRIPTION_LENGTH, hasErrors, validateTransfer } from '../../domain/validation';
import { AmountInput } from '../atoms/AmountInput';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { AccountSelector } from '../molecules/AccountSelector';
import { FormField } from '../molecules/FormField';

interface TransferFormProps {
  accounts: Account[];
  submitting: boolean;
  serverError?: string;
  onSubmit: (request: TransferRequest) => void;
}

const EMPTY: TransferFormValues = { sourceAccountId: '', targetAccountId: '', amount: '', description: '' };

export function TransferForm({ accounts, submitting, serverError, onSubmit }: TransferFormProps) {
  const [values, setValues] = useState<TransferFormValues>(EMPTY);
  const [errors, setErrors] = useState<TransferFormErrors>({});

  const update = (field: keyof TransferFormValues) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateTransfer(values, accounts);
    setErrors(found);
    if (hasErrors(found)) {
      return;
    }
    const source = accounts.find((a) => String(a.id) === values.sourceAccountId);
    if (!source) {
      return;
    }
    onSubmit({
      sourceAccountId: Number(values.sourceAccountId),
      targetAccountId: Number(values.targetAccountId),
      amount: values.amount.trim(),
      currency: source.currency,
      description: values.description.trim(),
    });
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate aria-label="Transferencia entre cuentas propias">
      <AccountSelector
        id="source"
        label="Cuenta de origen"
        accounts={accounts}
        value={values.sourceAccountId}
        onChange={update('sourceAccountId')}
        error={errors.sourceAccountId}
        showBalance
      />
      <AccountSelector
        id="target"
        label="Cuenta de destino"
        accounts={accounts}
        value={values.targetAccountId}
        onChange={update('targetAccountId')}
        error={errors.targetAccountId}
      />
      <FormField id="amount" label="Monto" error={errors.amount}>
        <AmountInput
          id="amount"
          value={values.amount}
          onChange={update('amount')}
          invalid={Boolean(errors.amount)}
          describedBy={errors.amount ? 'amount-error' : undefined}
        />
      </FormField>
      <FormField id="description" label="Descripción (opcional)" error={errors.description}>
        <Input
          id="description"
          maxLength={MAX_DESCRIPTION_LENGTH + 20}
          value={values.description}
          invalid={Boolean(errors.description)}
          onChange={(e) => update('description')(e.target.value)}
        />
      </FormField>
      {serverError ? (
        <p className="banner banner--error" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Transfiriendo…' : 'Transferir'}
      </Button>
    </form>
  );
}
