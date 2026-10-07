import type { CardDetail, CardSummary } from "../types/card";

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
// Cliente ficticio (hipotesis H1): en produccion lo resuelve la sesion de Banca por Internet.
const CUSTOMER_ID: string = import.meta.env.VITE_CUSTOMER_ID ?? "CUST-1001";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json", "X-Customer-Id": CUSTOMER_ID },
  });
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "La tarjeta solicitada no existe."
        : `No se pudo completar la consulta (HTTP ${response.status}).`,
    );
  }
  return (await response.json()) as T;
}

export function fetchCards(): Promise<CardSummary[]> {
  return getJson<CardSummary[]>("/api/v1/cards");
}

export function fetchCard(cardId: string): Promise<CardDetail> {
  return getJson<CardDetail>(`/api/v1/cards/${encodeURIComponent(cardId)}`);
}
