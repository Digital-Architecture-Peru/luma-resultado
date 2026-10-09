import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string | null;
  children: ReactNode;
}

/** Molécula: etiqueta + control + mensaje de error asociado. */
export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
