import type { CardSummary } from "../../types/card";
import CardSummaryItem from "../molecules/CardSummaryItem";

interface CardListProps {
  cards: CardSummary[];
  selectedId: string | null;
  onSelect: (cardId: string) => void;
}

export default function CardList({ cards, selectedId, onSelect }: CardListProps) {
  if (cards.length === 0) {
    return <p className="empty">No tienes tarjetas registradas.</p>;
  }
  return (
    <ul className="card-list" aria-label="Lista de tarjetas">
      {cards.map((card) => (
        <li key={card.id}>
          <CardSummaryItem card={card} selected={card.id === selectedId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
