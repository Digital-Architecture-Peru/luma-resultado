import type { Account } from '../../types';

interface AccountSelectorProps {
  id: string;
  accounts: Account[];
  value: string;
  onChange: (accountId: string) => void;
}

export function AccountSelector({ id, accounts, value, onChange }: AccountSelectorProps) {
  return (
    <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      {accounts.map((a) => (
        <option key={a.id} value={a.id}>
          {a.number} · {a.balance.toFixed(2)} {a.currency}
        </option>
      ))}
    </select>
  );
}
