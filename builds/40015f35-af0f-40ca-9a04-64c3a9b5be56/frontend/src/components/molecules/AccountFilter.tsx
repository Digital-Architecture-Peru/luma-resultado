import { TYPE_LABELS, type AccountType } from "../../domain/account";

export type TypeFilter = AccountType | "ALL";

interface AccountFilterProps {
  value: TypeFilter;
  onChange: (value: TypeFilter) => void;
}

export function AccountFilter({ value, onChange }: AccountFilterProps) {
  return (
    <label className="filter">
      Tipo de cuenta
      <select value={value} onChange={(e) => onChange(e.target.value as TypeFilter)}>
        <option value="ALL">Todas</option>
        {(Object.keys(TYPE_LABELS) as AccountType[]).map((type) => (
          <option key={type} value={type}>
            {TYPE_LABELS[type]}
          </option>
        ))}
      </select>
    </label>
  );
}
