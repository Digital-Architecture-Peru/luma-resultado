import { useState } from "react";
import CardDetailPanel from "../components/organisms/CardDetailPanel";
import CardList from "../components/organisms/CardList";
import CardsLayout from "../components/templates/CardsLayout";
import { useCardDetail, useCards } from "../hooks/useCards";

export default function CardsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cards = useCards();
  const detail = useCardDetail(selectedId);

  let list;
  if (cards.status === "loading" || cards.status === "idle") {
    list = <p role="status">Cargando tarjetas...</p>;
  } else if (cards.status === "error") {
    list = <p role="alert" className="error">{cards.message}</p>;
  } else {
    list = <CardList cards={cards.data} selectedId={selectedId} onSelect={setSelectedId} />;
  }

  return <CardsLayout list={list} detail={<CardDetailPanel state={detail} />} />;
}
