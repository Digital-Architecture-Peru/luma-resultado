import { formatMoney } from '../../domain/amount';
import type { Card } from '../../types';
import { Badge } from '../atoms/Badge';

interface CardSummaryProps {
  card: Card;
  selected: boolean;
  onSelect: (cardId: string) => void;
}

/** Molécula: resumen de tarjeta (solo últimos 4 dígitos). */
export function CardSummary({ card, selected, onSelect }: CardSummaryProps) {
  return (
    <button
      type="button"
      className={`card-summary${selected ? ' card-summary--selected' : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(card.id)}
    >
      <Badge>{card.brand}</Badge>
      <span className="card-summary__number">•••• {card.last4}</span>
      <span className="card-summary__balance">Deuda: {formatMoney(card.balance)}</span>
    </button>
  );
}
