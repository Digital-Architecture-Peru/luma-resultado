import type { ReactNode } from 'react';

interface BankLayoutProps {
  title: string;
  children: ReactNode;
}

/** Template: estructura de página de Banca por Internet. */
export function BankLayout({ title, children }: BankLayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
      </header>
      <main className="layout__main">{children}</main>
    </div>
  );
}
