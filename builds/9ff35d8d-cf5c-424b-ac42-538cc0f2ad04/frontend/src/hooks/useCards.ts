import { useEffect, useState } from "react";
import { fetchCard, fetchCards } from "../api/cardsApi";
import type { CardDetail, CardSummary } from "../types/card";

export type RemoteState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function useRemote<T>(load: (() => Promise<T>) | null, key: string): RemoteState<T> {
  const [state, setState] = useState<RemoteState<T>>({ status: load ? "loading" : "idle" });

  useEffect(() => {
    if (!load) {
      setState({ status: "idle" });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    load().then(
      (data) => {
        if (!cancelled) setState({ status: "success", data });
      },
      (error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Error desconocido.",
          });
        }
      },
    );
    return () => {
      cancelled = true;
    };
    // `key` identifica la consulta; `load` se recrea en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

export function useCards(): RemoteState<CardSummary[]> {
  return useRemote(fetchCards, "cards");
}

export function useCardDetail(cardId: string | null): RemoteState<CardDetail> {
  return useRemote(cardId ? () => fetchCard(cardId) : null, `card:${cardId ?? ""}`);
}
