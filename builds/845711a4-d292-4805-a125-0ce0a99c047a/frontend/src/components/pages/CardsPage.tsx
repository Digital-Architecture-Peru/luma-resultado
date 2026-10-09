import { useEffect, useState } from "react";
import { defaultCardsClient, type CardsClient } from "../../api/cardsClient";
import type { Card } from "../../types/card";
import { CardDetail } from "../organisms/CardDetail";
import { CardList } from "../organisms/CardList";
import { BankingLayout } from "../templates/BankingLayout";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; cards: Card[] };

interface CardsPageProps {
  client?: CardsClient;
}

export function CardsPage({ client = defaultCardsClient }: CardsPageProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    client
      .list()
      .then((cards) => {
        if (active) setState({ status: "success", cards });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Error desconocido";
        if (active) setState({ status: "error", message });
      });
    return () => {
      active = false;
    };
  }, [client]);

  const selected =
    state.status === "success" ? state.cards.find((card) => card.id === selectedId) : undefined;

  return (
    <BankingLayout title="Mis tarjetas">
      {state.status === "loading" && <p role="status">Cargando tarjetas…</p>}
      {state.status === "error" && <p role="alert">{state.message}</p>}
      {state.status === "success" && (
        <div className="cards-grid">
          <CardList cards={state.cards} selectedId={selectedId} onSelect={setSelectedId} />
          {selected && <CardDetail card={selected} />}
        </div>
      )}
    </BankingLayout>
  );
}
