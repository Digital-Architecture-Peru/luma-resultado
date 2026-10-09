import { describe, expect, it, vi } from 'vitest';
import { ApiError, createCardsApi } from './cardsApi';

const config = { baseUrl: 'http://api.test', customerId: 'cust-001' };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('cardsApi', () => {
  it('given cards endpoint when listCards then sends customer header and parses body', async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse([{ id: 'card-1', last4: '4242', brand: 'VISA', creditLimit: '5000.00', balance: '10.00' }]),
    );
    const api = createCardsApi(config, fetchMock as unknown as typeof fetch);

    const cards = await api.listCards();

    expect(cards[0]?.last4).toBe('4242');
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://api.test/api/v1/cards');
    expect((init.headers as Record<string, string>)['X-Customer-Id']).toBe('cust-001');
  });

  it('given a payment when payCard then posts amount as string with idempotency key', async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ transactionId: 'tx-1', cardId: 'card-1', amount: '150.00', status: 'POSTED', createdAt: '' }, 201),
    );
    const api = createCardsApi(config, fetchMock as unknown as typeof fetch);

    await api.payCard('card-1', 'acc-1', '150.00', 'key-1');

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://api.test/api/v1/cards/card-1/payments');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Idempotency-Key']).toBe('key-1');
    expect(init.body).toBe(JSON.stringify({ sourceAccountId: 'acc-1', amount: '150.00' }));
  });

  it('given a problem+json error when payCard then throws ApiError with detail', async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ detail: 'Saldo insuficiente en la cuenta de origen' }, 422),
    );
    const api = createCardsApi(config, fetchMock as unknown as typeof fetch);

    const failure = api.payCard('card-1', 'acc-1', '150.00', 'key-1');

    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({ status: 422, message: 'Saldo insuficiente en la cuenta de origen' });
  });
});
