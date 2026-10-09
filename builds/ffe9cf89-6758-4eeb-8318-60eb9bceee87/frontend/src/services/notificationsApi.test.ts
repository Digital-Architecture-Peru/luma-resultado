import { describe, expect, it, vi } from 'vitest';
import { ApiError, createNotificationsApi } from './notificationsApi';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('notificationsApi', () => {
  it('given a customer, when listing cards, then sends the customer header', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([]));
    const api = createNotificationsApi({ customerId: 'CLI-0001', fetchFn });

    await api.listCards();

    expect(fetchFn).toHaveBeenCalledWith(
      '/api/v1/cards',
      expect.objectContaining({ headers: expect.objectContaining({ 'X-Customer-Id': 'CLI-0001' }) }),
    );
  });

  it('given a status filter, when listing notifications, then builds the query string', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ items: [], page: 0, size: 20, total: 0 }));
    const api = createNotificationsApi({ customerId: 'CLI-0001', fetchFn });

    await api.listNotifications('card-1', 'UNREAD', 0, 20);

    expect(fetchFn.mock.calls[0]?.[0]).toBe('/api/v1/cards/card-1/notifications?page=0&size=20&status=UNREAD');
  });

  it('given a problem+json error, when requesting, then throws ApiError with the detail', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ detail: 'Tarjeta no encontrada' }, 404));
    const api = createNotificationsApi({ customerId: 'CLI-0001', fetchFn });

    const failure = api.getPreferences('x');

    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({ message: 'Tarjeta no encontrada', status: 404 });
  });

  it('given preferences, when updating, then PUTs them and unwraps the envelope', async () => {
    const prefs = [{ type: 'PAGO' as const, channel: 'EMAIL' as const, enabled: true }];
    const fetchFn = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ preferences: prefs }));
    const api = createNotificationsApi({ customerId: 'CLI-0001', fetchFn });

    const result = await api.updatePreferences('card-1', prefs);

    expect(result).toEqual(prefs);
    expect(fetchFn.mock.calls[0]?.[1]).toMatchObject({ method: 'PUT', body: JSON.stringify({ preferences: prefs }) });
  });
});
