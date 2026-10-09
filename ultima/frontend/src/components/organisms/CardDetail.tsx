import type { Card } from "../../types/card";
import { statusLabel, typeLabel } from "../../utils/format";
import { Amount } from "../atoms/Amount";

interface CardDetailProps {
  card: Card;
}

export function CardDetail({ card }: CardDetailProps) {
  return (
    <section className="card-detail" aria-label="Detalle de tarjeta">
      <h2>{card.maskedNumber}</h2>
      <dl>
        <dt>Marca</dt>
        <dd>{card.brand}</dd>
        <dt>Tipo</dt>
        <dd>{typeLabel(card.type)}</dd>
        <dt>Estado</dt>
        <dd>{statusLabel(card.status)}</dd>
        <dt>Vencimiento</dt>
        <dd>{card.expiry}</dd>
        <dt>Cupo</dt>
        <dd>
          <Amount value={card.creditLimit} currency={card.currency} />
        </dd>
        <dt>Disponible</dt>
        <dd>
          <Amount value={card.availableBalance} currency={card.currency} />
        </dd>
      </dl>
    </section>
  );
}
