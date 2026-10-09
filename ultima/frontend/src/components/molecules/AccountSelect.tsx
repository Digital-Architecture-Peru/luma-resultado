interface AccountSelectProps {
  id: string;
  label: string;
  accounts: readonly string[];
  value: string;
  onChange: (value: string) => void;
}

export function AccountSelect({ id, label, accounts, value, onChange }: AccountSelectProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {accounts.map((account) => (
          <option key={account} value={account}>
            {account}
          </option>
        ))}
      </select>
    </div>
  );
}
