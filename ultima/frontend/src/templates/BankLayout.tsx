import type { ReactNode } from "react";

interface BankLayoutProps {
  headerActions: ReactNode;
  children: ReactNode;
}

export function BankLayout({ headerActions, children }: BankLayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>Banca por Internet</h1>
        <div>{headerActions}</div>
      </header>
      <main className="layout__main">{children}</main>
    </div>
  );
}
