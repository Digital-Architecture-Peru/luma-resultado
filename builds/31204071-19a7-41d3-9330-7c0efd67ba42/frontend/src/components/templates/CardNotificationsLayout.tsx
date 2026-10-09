import type { ReactNode } from "react";

interface CardNotificationsLayoutProps {
  title: string;
  filters: ReactNode;
  main: ReactNode;
  aside: ReactNode;
}

/** Plantilla: distribución de la pantalla (encabezado, filtros, contenido principal y panel lateral). */
export function CardNotificationsLayout({ title, filters, main, aside }: CardNotificationsLayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
        <div className="layout__filters">{filters}</div>
      </header>
      <main className="layout__main">{main}</main>
      <aside className="layout__aside">{aside}</aside>
    </div>
  );
}
