import type { CardDetail } from "../../types/card";
import { formatMoney } from "../../utils/format";
import { StatusBadge } from "../atoms/StatusBadge";

export function CardDetailPanel({ card }: { card: CardDetail }) {
  return (
    <section className="detail" aria-label="Detalle de tarjeta">
      <h2>{card.productName}</h2>
      <StatusBadge status={card.status} />
      <dl>
        <dt>Número</dt>
        <dd>{card.maskedPan}</dd>
        <dt>Marca</dt>
        <dd>{card.brand}</dd>
        <dt>Vencimiento</dt>
        <dd>{card.expiry}</dd>
        <dt>Línea de crédito</dt>
        <dd>{formatMoney(card.creditLimit, card.currency)}</dd>
        <dt>Saldo disponible</dt>
        <dd>{formatMoney(card.availableBalance, card.currency)}</dd>
      </dl>
    </section>
  );
}
