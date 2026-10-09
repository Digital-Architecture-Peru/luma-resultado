import type { Card } from "../../types/card";
import { CardSummary } from "../molecules/CardSummary";

interface CardListProps {
  cards: Card[];
  selectedId?: string;
  onSelect: (cardId: string) => void;
}

export function CardList({ cards, selectedId, onSelect }: CardListProps) {
  if (cards.length === 0) {
    return <p className="empty">No tienes tarjetas asociadas.</p>;
  }

  return (
    <ul className="card-list" aria-label="Mis tarjetas">
      {cards.map((card) => (
        <li key={card.id}>
          <CardSummary card={card} selected={card.id === selectedId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
