import { useState } from "react";
import type { FormEvent } from "react";
import { formatMoney } from "../../domain/money";
import type { Account, TransferErrors, TransferFormValues, TransferRequest } from "../../domain/types";
import { hasErrors, validateTransfer } from "../../domain/validateTransfer";
import { Button } from "../atoms/Button";
import { SelectInput, TextInput } from "../atoms/Inputs";
import { FormField } from "../molecules/FormField";

interface TransferFormProps {
  accounts: Account[];
  submitting: boolean;
  onSubmit: (request: TransferRequest) => void | Promise<void>;
}

const EMPTY: TransferFormValues = { sourceId: "", targetId: "", amount: "", description: "" };

export function TransferForm({ accounts, submitting, onSubmit }: TransferFormProps) {
  const [values, setValues] = useState<TransferFormValues>(EMPTY);
  const [errors, setErrors] = useState<TransferErrors>({});

  const update = (field: keyof TransferFormValues, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateTransfer(values, accounts);
    setErrors(found);
    if (hasErrors(found)) return;
    void onSubmit({
      sourceAccountId: Number(values.sourceId),
      targetAccountId: Number(values.targetId),
      amount: values.amount.trim(),
      description: values.description.trim(),
    });
  };

  const options = accounts.map((a) => (
    <option key={a.id} value={String(a.id)}>
      {`${a.number} · ${formatMoney(a.balance, a.currency)}`}
    </option>
  ));

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField id="source" label="Cuenta origen" error={errors.source}>
        <SelectInput
          id="source"
          value={values.sourceId}
          aria-invalid={Boolean(errors.source)}
          onChange={(e) => update("sourceId", e.target.value)}
        >
          <option value="">Selecciona…</option>
          {options}
        </SelectInput>
      </FormField>
      <FormField id="target" label="Cuenta destino" error={errors.target}>
        <SelectInput
          id="target"
          value={values.targetId}
          aria-invalid={Boolean(errors.target)}
          onChange={(e) => update("targetId", e.target.value)}
        >
          <option value="">Selecciona…</option>
          {options}
        </SelectInput>
      </FormField>
      <FormField id="amount" label="Monto" error={errors.amount}>
        <TextInput
          id="amount"
          inputMode="decimal"
          autoComplete="off"
          value={values.amount}
          aria-invalid={Boolean(errors.amount)}
          onChange={(e) => update("amount", e.target.value)}
        />
      </FormField>
      <FormField id="description" label="Descripción">
        <TextInput
          id="description"
          maxLength={140}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </FormField>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Procesando…" : "Transferir"}
      </Button>
    </form>
  );
}
