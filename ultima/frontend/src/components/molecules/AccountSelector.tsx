import type { Account } from '../../domain/types';
import { FormField } from './FormField';

interface AccountSelectorProps {
  id: string;
  label: string;
  accounts: Account[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showBalance?: boolean;
}

export function AccountSelector({ id, label, accounts, value, onChange, error, showBalance }: AccountSelectorProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <select
        id={id}
        className="input"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecciona una cuenta</option>
        {accounts.map((a) => (
          <option key={a.id} value={String(a.id)}>
            {a.holderAlias} · {a.number}
            {showBalance ? ` · ${a.balance} ${a.currency}` : ` · ${a.currency}`}
          </option>
        ))}
      </select>
    </FormField>
  );
}
