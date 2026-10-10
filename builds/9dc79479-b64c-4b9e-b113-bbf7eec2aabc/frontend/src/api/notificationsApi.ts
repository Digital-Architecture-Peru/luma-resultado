import type { AccountNotification, NotificationPreference, NotificationsApi } from './types';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080';
// Identidad simulada (hipótesis H2): reemplazar por autenticación real.
const demoCustomer = import.meta.env.VITE_DEMO_CUSTOMER_ID ?? 'CUST-0001';

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Demo-Customer': demoCustomer,
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`La solicitud falló (${response.status})`);
  }
  return response;
}

export const notificationsApi: NotificationsApi = {
  async list(accountId: string, unreadOnly: boolean): Promise<AccountNotification[]> {
    const query = unreadOnly ? '?unreadOnly=true' : '';
    const response = await request(`/api/accounts/${encodeURIComponent(accountId)}/notifications${query}`);
    return (await response.json()) as AccountNotification[];
  },

  async markRead(id: string): Promise<void> {
    await request(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
  },

  async getPreferences(accountId: string): Promise<NotificationPreference[]> {
    const response = await request(`/api/accounts/${encodeURIComponent(accountId)}/notification-preferences`);
    return (await response.json()) as NotificationPreference[];
  },

  async savePreferences(accountId: string, preferences: NotificationPreference[]): Promise<void> {
    await request(`/api/accounts/${encodeURIComponent(accountId)}/notification-preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};
