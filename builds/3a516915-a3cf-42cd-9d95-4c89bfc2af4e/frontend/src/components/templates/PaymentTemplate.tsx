import type { ReactNode } from 'react';

export function PaymentTemplate({ children }: { children: ReactNode }) {
  return (
    <main className="page">
      <header>
        <h1>Pagos</h1>
        <p className="muted">Banca por Internet · Transferencia a cuenta de terceros</p>
      </header>
      {children}
    </main>
  );
}
