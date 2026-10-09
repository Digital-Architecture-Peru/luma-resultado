import type { InputHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function FormField({ id, label, error, ...rest }: FormFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} {...rest} />
      {error && (
        <p id={errorId} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
