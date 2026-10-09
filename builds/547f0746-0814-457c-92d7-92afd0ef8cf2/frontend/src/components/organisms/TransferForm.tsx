import { useState, type FormEvent } from "react";
import { isValidAmount } from "../../lib/amount";
import type { Account, TransferInput } from "../../types";
import { Button } from "../atoms/Button";
import { TextInput } from "../atoms/TextInput";
import { AccountSelect } from "../molecules/AccountSelect";
import { AmountInput } from "../molecules/AmountInput";
import { FormField } from "../molecules/FormField";

interface TransferFormProps {
  accounts: Account[];
  submitting: boolean;
  onSubmit: (input: TransferInput) => void;
}

export function TransferForm({ accounts, submitting, onSubmit }: TransferFormProps) {
  const [sourceId, setSourceId] = useState<number | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);

  const sameAccount = sourceId !== null && sourceId === targetId;
  const isValid = sourceId !== null && targetId !== null && !sameAccount && isValidAmount(amount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (submitting || !isValid || sourceId === null || targetId === null) return;
    const source = accounts.find((a) => a.id === sourceId);
    onSubmit({
      sourceAccountId: sourceId,
      targetAccountId: targetId,
      amount,
      currency: source?.currency ?? "USD",
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Transferencia entre cuentas propias">
      <AccountSelect
        id="source"
        label="Cuenta origen"
        accounts={accounts}
        value={sourceId}
        onChange={setSourceId}
        error={touched && sourceId === null ? "Seleccione la cuenta origen" : undefined}
      />
      <AccountSelect
        id="target"
        label="Cuenta destino"
        accounts={accounts}
        value={targetId}
        onChange={setTargetId}
        error={
          touched && targetId === null
            ? "Seleccione la cuenta destino"
            : sameAccount
              ? "La cuenta destino debe ser distinta del origen"
              : undefined
        }
      />
      <AmountInput value={amount} onChange={setAmount} touched={touched} />
      <FormField id="description" label="Descripción (opcional)">
        <TextInput
          id="description"
          maxLength={140}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Procesando…" : "Transferir"}
      </Button>
    </form>
  );
}
