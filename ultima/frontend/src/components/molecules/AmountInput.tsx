import { isValidAmount } from "../../lib/amount";
import { TextInput } from "../atoms/TextInput";
import { FormField } from "./FormField";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  touched: boolean;
}

export function AmountInput({ value, onChange, touched }: AmountInputProps) {
  const invalid = touched && !isValidAmount(value);
  return (
    <FormField id="amount" label="Monto" error={invalid ? "Ingrese un monto mayor a 0 con hasta 2 decimales" : undefined}>
      <TextInput
        id="amount"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        invalid={invalid}
        aria-describedby={invalid ? "amount-error" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormField>
  );
}
