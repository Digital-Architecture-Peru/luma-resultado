import type { ReactNode } from "react";

interface ConsultaLayoutProps {
  titulo: string;
  filtros: ReactNode;
  children: ReactNode;
}

export function ConsultaLayout({ titulo, filtros, children }: ConsultaLayoutProps) {
  return (
    <div className="layout">
      <header>
        <h1>{titulo}</h1>
      </header>
      <aside aria-label="Filtros">{filtros}</aside>
      <main>{children}</main>
    </div>
  );
}
