import type { ReactNode } from 'react';

export function BankingLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="layout">
      <header>
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
