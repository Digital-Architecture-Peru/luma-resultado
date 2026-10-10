import type { Page, PaymentNotification } from '../types/notification';
import type { NotificationsApi } from './notificationsApi';

const PAGE_SIZE = 50;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createHttpApi(baseUrl: string, customerId: string): NotificationsApi {
  const root = `${baseUrl.replace(/\/$/, '')}/api/v1/notifications`;

  async function request<T>(path: string, method: 'GET' | 'PATCH' = 'GET'): Promise<T> {
    const response = await fetch(`${root}${path}`, {
      method,
      headers: { 'X-Customer-Id': customerId, Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new ApiError(response.status, `Solicitud fallida (${response.status})`);
    }
    return (await response.json()) as T;
  }

  return {
    list: (filter) =>
      request<Page<PaymentNotification>>(`?status=${filter}&page=1&size=${PAGE_SIZE}`),
    unreadCount: async () => (await request<{ count: number }>('/unread-count')).count,
    markAsRead: (id) => request<PaymentNotification>(`/${encodeURIComponent(id)}/read`, 'PATCH'),
  };
}
