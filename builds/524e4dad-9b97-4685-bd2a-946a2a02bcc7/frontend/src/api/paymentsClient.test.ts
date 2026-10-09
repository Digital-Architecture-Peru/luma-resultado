import { describe, expect, it, vi } from 'vitest';
import { buildListUrl, createPaymentsClient } from './paymentsClient';

describe('paymentsClient', () => {
  it('given filters when building url then includes only provided params', () => {
    const url = buildListUrl('http://api', {
      from: '2026-09-01',
      status: 'PENDING',
      page: 2,
      pageSize: 10,
    });

    expect(url).toContain('/api/payments?');
    expect(url).toContain('status=PENDING');
    expect(url).toContain('page=2');
    expect(url).toContain('from=2026-09-01T00%3A00%3A00Z');
    expect(url).not.toContain('to=');
  });

  it('given ok response when list then returns body and sends customer header', async () => {
    const body = { items: [], page: 1, pageSize: 20, total: 0 };
    const fetchFn = vi.fn(
      async (_input: string, _init?: RequestInit) =>
        new Response(JSON.stringify(body), { status: 200 }),
    );
    const client = createPaymentsClient('http://api', 'cust-1', fetchFn);

    const result = await client.list({ page: 1, pageSize: 20 });

    expect(result).toEqual(body);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const init = fetchFn.mock.calls[0]?.[1];
    expect(init).toBeDefined();
    const headers = init?.headers as Record<string, string>;
    expect(headers['X-Customer-Id']).toBe('cust-1');
  });

  it('given error response when list then rejects with status', async () => {
    const fetchFn = vi.fn(
      async (_input: string, _init?: RequestInit) => new Response('{}', { status: 500 }),
    );
    const client = createPaymentsClient('http://api', 'cust-1', fetchFn);

    await expect(client.list({ page: 1, pageSize: 20 })).rejects.toThrow('HTTP 500');
  });
});
