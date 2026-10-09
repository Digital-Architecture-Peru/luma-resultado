import type { ReactNode } from 'react';

interface TransactionLayoutProps {
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}

export function TransactionLayout({ title, children, aside }: TransactionLayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
        <p className="muted">Banca por Internet · Cuentas</p>
      </header>
      <main className="layout__main">{children}</main>
      {aside ? <aside className="layout__aside">{aside}</aside> : null}
    </div>
  );
}
