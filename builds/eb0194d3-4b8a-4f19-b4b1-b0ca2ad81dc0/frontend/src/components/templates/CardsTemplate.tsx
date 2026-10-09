import type { ReactNode } from "react";

interface CardsTemplateProps {
  search: ReactNode;
  list: ReactNode;
  detail?: ReactNode;
}

export function CardsTemplate({ search, list, detail }: CardsTemplateProps) {
  return (
    <main className="layout">
      <h1>Consulta de tarjetas</h1>
      {search}
      <div className="layout__content">
        <section aria-label="Tarjetas del cliente">{list}</section>
        {detail ? <aside>{detail}</aside> : null}
      </div>
    </main>
  );
}
