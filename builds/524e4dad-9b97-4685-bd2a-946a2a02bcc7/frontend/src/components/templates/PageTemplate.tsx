import type { ReactNode } from 'react';

export function PageTemplate({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="page">
      <header>
        <h1>{title}</h1>
        <p className="subtitle">Banca por Internet · Datos ficticios de demostración</p>
      </header>
      {children}
    </main>
  );
}
