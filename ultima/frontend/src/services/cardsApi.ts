import type { CardDetail, CardSummary } from "../types/card";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface CardsApi {
  listCards(customerId: string): Promise<CardSummary[]>;
  getCard(cardId: string): Promise<CardDetail>;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const DEFAULT_BASE_URL = "http://localhost:5080";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = `Error ${response.status}`;
    try {
      const problem = (await response.json()) as { detail?: string };
      if (problem.detail) {
        detail = problem.detail;
      }
    } catch {
      // cuerpo no JSON: se conserva el mensaje genérico
    }
    throw new ApiError(response.status, detail);
  }
  return (await response.json()) as T;
}

export function createCardsApi(
  baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  fetchFn: FetchLike = (input, init) => fetch(input, init),
): CardsApi {
  const root = baseUrl.replace(/\/+$/, "");
  return {
    async listCards(customerId) {
      const response = await fetchFn(`${root}/api/v1/customers/${encodeURIComponent(customerId)}/cards`);
      return readJson<CardSummary[]>(response);
    },
    async getCard(cardId) {
      const response = await fetchFn(`${root}/api/v1/cards/${encodeURIComponent(cardId)}`);
      return readJson<CardDetail>(response);
    },
  };
}
