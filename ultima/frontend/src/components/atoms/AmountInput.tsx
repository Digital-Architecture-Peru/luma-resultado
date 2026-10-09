import { Input } from './Input';

interface AmountInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
}

/** Campo de monto: solo admite dígitos y un punto decimal, como texto (sin floats). */
export function AmountInput({ id, value, onChange, invalid, describedBy }: AmountInputProps) {
  return (
    <Input
      id={id}
      inputMode="decimal"
      autoComplete="off"
      placeholder="0.00"
      value={value}
      invalid={invalid}
      aria-describedby={describedBy}
      onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
    />
  );
}
