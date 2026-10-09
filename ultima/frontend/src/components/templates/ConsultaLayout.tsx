import type { ReactNode } from "react";

interface Props {
  titulo: string;
  children: ReactNode;
}

export function ConsultaLayout({ titulo, children }: Props) {
  return (
    <main className="layout">
      <header>
        <h1>{titulo}</h1>
      </header>
      {children}
    </main>
  );
}
