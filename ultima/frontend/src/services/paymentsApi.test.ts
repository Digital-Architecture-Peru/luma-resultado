import { describe, expect, it } from 'vitest';
import { ApiError, createPaymentsApi } from './paymentsApi';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('paymentsApi', () => {
  it('given filters when list then builds query string and sends customer header', async () => {
    let url = '';
    let headers: HeadersInit | undefined;
    const api = createPaymentsApi('http://api.test/', 'CUST-0001', async (input, init) => {
      url = input;
      headers = init?.headers;
      return jsonResponse({ items: [], page: 0, size: 20, total: 0 });
    });

    await api.list({ from: '2026-09-01', status: 'PENDING', page: 0, size: 20 });

    expect(url).toBe('http://api.test/api/v1/payments?from=2026-09-01&status=PENDING&page=0&size=20');
    expect(headers).toMatchObject({ 'X-Customer-Id': 'CUST-0001' });
  });

  it('given no filters when list then omits the query string', async () => {
    let url = '';
    const api = createPaymentsApi('http://api.test', 'C', async (input) => {
      url = input;
      return jsonResponse({ items: [], page: 0, size: 20, total: 0 });
    });

    await api.list({ status: '' });

    expect(url).toBe('http://api.test/api/v1/payments');
  });

  it('given 404 with error body when get then throws ApiError with code', async () => {
    const api = createPaymentsApi('http://api.test', 'C', async () =>
      jsonResponse({ code: 'PAYMENT_NOT_FOUND', message: 'Pago no encontrado' }, 404),
    );

    await expect(api.get('abc')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      code: 'PAYMENT_NOT_FOUND',
      message: 'Pago no encontrado',
    });
    await expect(api.get('abc')).rejects.toBeInstanceOf(ApiError);
  });

  it('given non JSON error body when list then throws generic ApiError', async () => {
    const api = createPaymentsApi('http://api.test', 'C', async () => new Response('boom', { status: 500 }));

    await expect(api.list({})).rejects.toMatchObject({ status: 500, code: 'HTTP_ERROR' });
  });
});
