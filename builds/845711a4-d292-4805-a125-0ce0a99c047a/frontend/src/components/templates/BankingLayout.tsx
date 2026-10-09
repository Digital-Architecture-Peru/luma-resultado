import type { ReactNode } from "react";

interface BankingLayoutProps {
  title: string;
  children: ReactNode;
}

export function BankingLayout({ title, children }: BankingLayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
      </header>
      <main className="layout__main">{children}</main>
    </div>
  );
}
