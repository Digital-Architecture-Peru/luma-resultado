import type { ReactNode } from 'react';

interface BankingLayoutProps {
  title: string;
  children: ReactNode;
}

export function BankingLayout({ title, children }: BankingLayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
        <p className="layout__note">Demo con datos ficticios · identidad simulada</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
