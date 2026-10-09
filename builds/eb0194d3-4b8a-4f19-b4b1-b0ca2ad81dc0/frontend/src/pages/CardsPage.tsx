import { useCallback, useEffect, useMemo, useState } from "react";
import { CardDetailPanel } from "../components/organisms/CardDetailPanel";
import { CardList, type CardsState } from "../components/organisms/CardList";
import { CustomerSearch } from "../components/molecules/CustomerSearch";
import { CardsTemplate } from "../components/templates/CardsTemplate";
import { createCardsApi, type CardsApi } from "../services/cardsApi";
import type { CardDetail } from "../types/card";

const DEMO_CUSTOMER_ID = "demo-001";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

export function CardsPage({ api }: { api?: CardsApi }) {
  const service = useMemo(() => api ?? createCardsApi(), [api]);
  const [state, setState] = useState<CardsState>({ kind: "idle" });
  const [detail, setDetail] = useState<CardDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const search = useCallback(
    async (customerId: string) => {
      setState({ kind: "loading" });
      setDetail(null);
      setDetailError(null);
      try {
        setState({ kind: "success", cards: await service.listCards(customerId) });
      } catch (error) {
        setState({ kind: "error", message: errorMessage(error) });
      }
    },
    [service],
  );

  const select = useCallback(
    async (cardId: string) => {
      setDetailError(null);
      try {
        setDetail(await service.getCard(cardId));
      } catch (error) {
        setDetail(null);
        setDetailError(errorMessage(error));
      }
    },
    [service],
  );

  useEffect(() => {
    void search(DEMO_CUSTOMER_ID);
  }, [search]);

  return (
    <CardsTemplate
      search={
        <CustomerSearch
          initialValue={DEMO_CUSTOMER_ID}
          disabled={state.kind === "loading"}
          onSearch={(id) => void search(id)}
        />
      }
      list={<CardList state={state} onSelect={(id) => void select(id)} />}
      detail={
        detailError ? (
          <p role="alert" className="error">{detailError}</p>
        ) : detail ? (
          <CardDetailPanel card={detail} />
        ) : null
      }
    />
  );
}
