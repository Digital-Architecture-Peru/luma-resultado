import type { Account } from "../../types";
import { FormField } from "./FormField";

interface AccountSelectProps {
  id: string;
  label: string;
  accounts: Account[];
  value: number | null;
  onChange: (id: number | null) => void;
  error?: string;
}

export function AccountSelect({ id, label, accounts, value, onChange, error }: AccountSelectProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <select
        id={id}
        className="input"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      >
        <option value="">Seleccione una cuenta</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.number} · {a.balance} {a.currency}
          </option>
        ))}
      </select>
    </FormField>
  );
}
