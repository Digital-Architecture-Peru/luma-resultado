import type { Card, PaymentRequest, Transaction } from '../domain/types';

export interface CardTransactionsApi {
  listCards(): Promise<Card[]>;
  listTransactions(cardId: string): Promise<Transaction[]>;
  createPayment(request: PaymentRequest, idempotencyKey: string): Promise<Transaction>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const baseUrl: string = import.meta.env.VITE_API_URL ?? 'http://localhost:5080';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, init);
  } catch {
    throw new ApiError('No se pudo conectar con el servicio. Intenta nuevamente.', 0);
  }

  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as { detail?: string; title?: string } | null;
    throw new ApiError(problem?.detail ?? problem?.title ?? 'Error inesperado del servicio.', response.status);
  }
  return (await response.json()) as T;
}

export const httpCardTransactionsApi: CardTransactionsApi = {
  listCards: () => request<Card[]>('/v1/cards'),
  listTransactions: (cardId) => request<Transaction[]>(`/v1/cards/${encodeURIComponent(cardId)}/transactions`),
  createPayment: (payment, idempotencyKey) =>
    request<Transaction>('/v1/card-payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(payment),
    }),
};
