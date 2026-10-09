import type { ReactNode } from 'react';

interface ConsultaLayoutProps {
  titulo: string;
  filtros: ReactNode;
  children: ReactNode;
}

export function ConsultaLayout({ titulo, filtros, children }: ConsultaLayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{titulo}</h1>
        <p className="muted">Banca por Internet · datos de demostración</p>
      </header>
      <section className="card" aria-label="Filtros">
        {filtros}
      </section>
      <main className="card">{children}</main>
    </div>
  );
}
