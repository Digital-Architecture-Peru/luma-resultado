import type { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function DateField({ label, id, ...rest }: FieldProps) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="date" {...rest} />
    </label>
  );
}
