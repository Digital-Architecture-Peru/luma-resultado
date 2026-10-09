import type { Card, CardStatus } from "../../types/card";
import { statusLabel, typeLabel } from "../../utils/format";
import { Amount } from "../atoms/Amount";
import { Badge, type BadgeTone } from "../atoms/Badge";

interface CardSummaryProps {
  card: Card;
  selected?: boolean;
  onSelect: (cardId: string) => void;
}

const STATUS_TONE: Record<CardStatus, BadgeTone> = {
  ACTIVE: "success",
  BLOCKED: "danger",
  EXPIRED: "neutral",
};

export function CardSummary({ card, selected = false, onSelect }: CardSummaryProps) {
  return (
    <button
      type="button"
      className={`card-summary${selected ? " card-summary--selected" : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(card.id)}
    >
      <span className="card-summary__title">
        {card.brand} · {typeLabel(card.type)}
      </span>
      <span className="card-summary__number">{card.maskedNumber}</span>
      <span className="card-summary__row">
        <Badge label={statusLabel(card.status)} tone={STATUS_TONE[card.status]} />
        <Amount value={card.availableBalance} currency={card.currency} />
      </span>
    </button>
  );
}
