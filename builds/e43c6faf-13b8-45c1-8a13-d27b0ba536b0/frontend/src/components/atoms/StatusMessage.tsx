import type { ReactNode } from 'react';

interface Props {
  kind: 'error' | 'info';
  children: ReactNode;
}

/** Mensaje accesible: los errores usan role="alert" y la información role="status". */
export function StatusMessage({ kind, children }: Props) {
  return (
    <p className={`message message--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
