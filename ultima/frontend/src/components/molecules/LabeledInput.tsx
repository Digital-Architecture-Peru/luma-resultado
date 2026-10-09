import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Molécula: etiqueta asociada + input. */
export function LabeledInput({ label, ...rest }: FieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...rest} />
    </div>
  );
}
