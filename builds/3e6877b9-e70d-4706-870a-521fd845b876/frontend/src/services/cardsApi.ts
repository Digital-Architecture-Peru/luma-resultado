import type { Account, Card, Page, PaymentResult, Transaction } from '../types';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface CardsApiConfig {
  baseUrl: string;
  customerId: string;
}

export interface CardsApi {
  listCards(): Promise<Card[]>;
  listAccounts(): Promise<Account[]>;
  listTransactions(cardId: string, page?: number, size?: number): Promise<Page<Transaction>>;
  payCard(cardId: string, sourceAccountId: string, amount: string, idempotencyKey: string): Promise<PaymentResult>;
}

async function readDetail(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { detail?: string };
    if (body.detail) return body.detail;
  } catch {
    // cuerpo no JSON: se usa el mensaje genérico
  }
  return `Error ${res.status} al procesar la solicitud`;
}

export function createCardsApi(
  config: CardsApiConfig,
  fetchFn: typeof fetch = (input, init) => fetch(input, init),
): CardsApi {
  async function request<T>(
    path: string,
    method: 'GET' | 'POST',
    extraHeaders: Record<string, string> = {},
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Customer-Id': config.customerId,
      ...extraHeaders,
    };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const res = await fetchFn(`${config.baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new ApiError(res.status, await readDetail(res));
    return (await res.json()) as T;
  }

  return {
    listCards: () => request<Card[]>('/api/v1/cards', 'GET'),
    listAccounts: () => request<Account[]>('/api/v1/accounts', 'GET'),
    listTransactions: (cardId, page = 0, size = 20) =>
      request<Page<Transaction>>(
        `/api/v1/cards/${encodeURIComponent(cardId)}/transactions?page=${page}&size=${size}`,
        'GET',
      ),
    payCard: (cardId, sourceAccountId, amount, idempotencyKey) =>
      request<PaymentResult>(
        `/api/v1/cards/${encodeURIComponent(cardId)}/payments`,
        'POST',
        { 'Idempotency-Key': idempotencyKey },
        { sourceAccountId, amount },
      ),
  };
}
