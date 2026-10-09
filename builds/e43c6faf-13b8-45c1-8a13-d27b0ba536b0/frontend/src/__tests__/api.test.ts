import { describe, expect, it, vi } from 'vitest';
import { ApiError, createTransactionApi } from '../services/api';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('createTransactionApi', () => {
  it('given a card when listing then requests the list endpoint with limit', async () => {
    const fetchMock = vi.fn(async (_input: string, _init?: RequestInit) => jsonResponse([]));
    const api = createTransactionApi('/api/v1', fetchMock);

    const result = await api.list('card-1', 5);

    expect(result).toEqual([]);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/cards/card-1/transactions?limit=5');
  });

  it('given a transaction when creating then sends POST with the Idempotency-Key header', async () => {
    const fetchMock = vi.fn(async (_input: string, _init?: RequestInit) => jsonResponse({ id: 'x' }, 201));
    const api = createTransactionApi('/api/v1', fetchMock);

    await api.create('card-1', { type: 'PAYMENT', amount: 10, currency: 'USD', description: '' }, 'key-1');

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.method).toBe('POST');
    expect((init?.headers as Record<string, string>)['Idempotency-Key']).toBe('key-1');
  });

  it('given a problem response when creating then throws ApiError with the detail', async () => {
    const fetchMock = vi.fn(async (_input: string, _init?: RequestInit) =>
      jsonResponse({ title: 'x', status: 422, detail: 'Saldo disponible insuficiente' }, 422),
    );
    const api = createTransactionApi('/api/v1', fetchMock);

    await expect(
      api.create('card-1', { type: 'PURCHASE', amount: 9999, currency: 'USD', description: '' }, 'k'),
    ).rejects.toEqual(new ApiError(422, 'Saldo disponible insuficiente'));
  });
});
