import type { ReactNode } from 'react';

interface Props {
  id: string;
  label: string;
  children: ReactNode;
}

/** Molécula: etiqueta asociada a un control (input o select). */
export function FormField({ id, label, children }: Props) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}
