import type { ReactNode } from 'react';

export function PageTemplate({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="shell">
      <header className="shell-header">
        <h1>{title}</h1>
        <p className="muted">Banca por Internet · Datos de demostración</p>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}
