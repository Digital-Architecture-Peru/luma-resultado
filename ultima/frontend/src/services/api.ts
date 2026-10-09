export type TransactionType = 'PURCHASE' | 'PAYMENT' | 'REFUND';

export interface CardTransaction {
  id: string;
  cardId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string | null;
  status: 'APPROVED' | 'DECLINED';
  createdAt: string;
}

export interface NewTransaction {
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
}

export interface TransactionApi {
  list(cardId: string, limit?: number): Promise<CardTransaction[]>;
  create(cardId: string, tx: NewTransaction, idempotencyKey: string): Promise<CardTransaction>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

async function parse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }
  let detail = `Error ${response.status}`;
  try {
    const problem = (await response.json()) as { detail?: string };
    if (problem.detail) {
      detail = problem.detail;
    }
  } catch {
    // El cuerpo no era JSON; se conserva el mensaje genérico.
  }
  throw new ApiError(response.status, detail);
}

export function createTransactionApi(
  baseUrl: string = import.meta.env.VITE_API_URL ?? '/api/v1',
  fetchImpl: FetchLike = (input, init) => fetch(input, init),
): TransactionApi {
  return {
    async list(cardId, limit = 20) {
      const response = await fetchImpl(`${baseUrl}/cards/${cardId}/transactions?limit=${limit}`);
      return parse<CardTransaction[]>(response);
    },
    async create(cardId, tx, idempotencyKey) {
      const response = await fetchImpl(`${baseUrl}/cards/${cardId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(tx),
      });
      return parse<CardTransaction>(response);
    },
  };
}
