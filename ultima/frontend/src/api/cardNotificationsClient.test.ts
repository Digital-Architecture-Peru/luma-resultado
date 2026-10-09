import { describe, expect, it, vi } from 'vitest';
import { ApiError, createCardNotificationsClient } from './cardNotificationsClient';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('cardNotificationsClient', () => {
  it('given a filter, when listing, then requests the versioned endpoint with query params', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ items: [], unread: 0, page: 1, size: 20 }));
    const client = createCardNotificationsClient(fetchFn);

    const page = await client.list('unread');

    expect(page.unread).toBe(0);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn.mock.calls[0][0]).toBe('/api/v1/cards/notifications?status=unread&page=1&size=20');
  });

  it('given an id, when marking read, then sends PATCH to the read endpoint', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const client = createCardNotificationsClient(fetchFn);

    await client.markRead('abc');

    expect(fetchFn.mock.calls[0][0]).toBe('/api/v1/cards/notifications/abc/read');
    expect(fetchFn.mock.calls[0][1]).toMatchObject({ method: 'PATCH' });
  });

  it('given a problem+json response, when requesting, then throws ApiError with status and detail', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ title: 'Datos inválidos', detail: 'No se puede desactivar' }, 422));
    const client = createCardNotificationsClient(fetchFn);

    const error = await client.savePreferences([]).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(422);
    expect((error as ApiError).message).toBe('No se puede desactivar');
  });

  it('given preferences, when saving, then wraps them in the request body', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse([]));
    const client = createCardNotificationsClient(fetchFn);

    await client.savePreferences([{ eventType: 'LimitChanged', channel: 'Email', enabled: true }]);

    const init = fetchFn.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body as string)).toEqual({
      preferences: [{ eventType: 'LimitChanged', channel: 'Email', enabled: true }],
    });
  });
});
