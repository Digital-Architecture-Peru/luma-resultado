import type { ReactNode } from 'react';

interface PaginaLayoutProps {
  titulo: string;
  children: ReactNode;
}

export function PaginaLayout({ titulo, children }: PaginaLayoutProps) {
  return (
    <main className="pagina">
      <h1>{titulo}</h1>
      {children}
    </main>
  );
}
