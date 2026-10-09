import type { Card } from "../types/card";

export interface CardsClient {
  list(): Promise<Card[]>;
  get(cardId: string): Promise<Card>;
}

export function createCardsClient(
  baseUrl: string,
  customerId: string,
  fetchFn: typeof fetch = (...args) => fetch(...args),
): CardsClient {
  async function request<T>(path: string): Promise<T> {
    const response = await fetchFn(`${baseUrl}/api/v1/cards${path}`, {
      headers: { "X-Customer-Id": customerId },
    });
    if (!response.ok) {
      throw new Error(`No se pudo consultar las tarjetas (HTTP ${response.status})`);
    }
    return (await response.json()) as T;
  }

  return {
    list: () => request<Card[]>(""),
    get: (cardId) => request<Card>(`/${encodeURIComponent(cardId)}`),
  };
}

export const defaultCardsClient: CardsClient = createCardsClient(
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080",
  import.meta.env.VITE_CUSTOMER_ID ?? "11111111-1111-4111-8111-111111111111",
);
