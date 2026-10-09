import type { CardSummary } from "../../types/card";
import { CardItem } from "../molecules/CardItem";

export type CardsState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; cards: CardSummary[] }
  | { kind: "error"; message: string };

interface CardListProps {
  state: CardsState;
  onSelect: (cardId: string) => void;
}

export function CardList({ state, onSelect }: CardListProps) {
  switch (state.kind) {
    case "idle":
      return <p className="muted">Ingresa un código de cliente para consultar sus tarjetas.</p>;
    case "loading":
      return <p role="status">Cargando tarjetas…</p>;
    case "error":
      return <p role="alert" className="error">{state.message}</p>;
    case "success":
      if (state.cards.length === 0) {
        return <p role="status">El cliente no tiene tarjetas registradas.</p>;
      }
      return (
        <div className="card-grid">
          {state.cards.map((card) => (
            <CardItem key={card.id} card={card} onSelect={onSelect} />
          ))}
        </div>
      );
  }
}
