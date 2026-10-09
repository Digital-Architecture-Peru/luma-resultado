import type { CardSummary } from "../../types/card";
import { formatMoney } from "../../utils/format";
import { Button } from "../atoms/Button";
import { StatusBadge } from "../atoms/StatusBadge";

interface CardItemProps {
  card: CardSummary;
  onSelect: (cardId: string) => void;
}

export function CardItem({ card, onSelect }: CardItemProps) {
  return (
    <article className="card-item" aria-label={card.productName}>
      <header className="card-item__header">
        <h3>{card.productName}</h3>
        <StatusBadge status={card.status} />
      </header>
      <p className="card-item__pan">{card.maskedPan}</p>
      <p className="card-item__balance">
        <span className="muted">Disponible</span> {formatMoney(card.availableBalance, card.currency)}
      </p>
      <Button variant="ghost" onClick={() => onSelect(card.id)}>
        Ver detalle de {card.productName}
      </Button>
    </article>
  );
}
