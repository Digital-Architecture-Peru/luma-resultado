import type { ReactNode } from 'react';

export function PaginaLayout({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="layout">
      <header className="layout__cabecera">
        <h1>{titulo}</h1>
      </header>
      <main className="layout__contenido">{children}</main>
    </div>
  );
}
