import type { CardSummary } from "../../types/card";
import Amount from "../atoms/Amount";
import MaskedPan from "../atoms/MaskedPan";
import StatusBadge from "../atoms/StatusBadge";

interface CardSummaryItemProps {
  card: CardSummary;
  selected: boolean;
  onSelect: (cardId: string) => void;
}

export default function CardSummaryItem({ card, selected, onSelect }: CardSummaryItemProps) {
  return (
    <button
      type="button"
      className={`card-item${selected ? " card-item--selected" : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(card.id)}
    >
      <span className="card-item__alias">{card.alias}</span>
      <MaskedPan value={card.maskedNumber} />
      <span className="card-item__footer">
        <StatusBadge status={card.status} />
        <Amount value={card.availableBalance} currency={card.currency} />
      </span>
    </button>
  );
}
