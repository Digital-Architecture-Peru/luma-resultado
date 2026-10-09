import { isPartialAmount } from '../../utils/amount';

interface AmountInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
}

/** Solo propaga cambios con formato de monto válido (dígitos y hasta 2 decimales). */
export function AmountInput({ id, value, onChange, invalid, describedBy }: AmountInputProps) {
  return (
    <input
      id={id}
      className="input"
      inputMode="decimal"
      autoComplete="off"
      value={value}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={describedBy}
      onChange={(e) => {
        if (isPartialAmount(e.target.value)) onChange(e.target.value);
      }}
    />
  );
}
