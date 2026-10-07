import type { ReactNode } from "react";

interface CardsLayoutProps {
  list: ReactNode;
  detail: ReactNode;
}

export default function CardsLayout({ list, detail }: CardsLayoutProps) {
  return (
    <main className="layout">
      <header className="layout__header">
        <h1>Mis tarjetas</h1>
        <p>Consulta el estado y los saldos de tus tarjetas.</p>
      </header>
      <div className="layout__grid">
        <section aria-label="Tarjetas">{list}</section>
        <aside aria-label="Detalle">{detail}</aside>
      </div>
    </main>
  );
}
