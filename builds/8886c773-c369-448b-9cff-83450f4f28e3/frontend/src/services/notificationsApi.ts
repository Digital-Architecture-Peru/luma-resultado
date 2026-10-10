import type { AccountNotification, NotificationStatus, Preference } from "../types/notifications";

/** Puerto de acceso a datos; los componentes dependen de esta interfaz, no de fetch. */
export interface NotificationsApi {
  list(accountId: string, status?: NotificationStatus): Promise<AccountNotification[]>;
  markRead(id: string): Promise<AccountNotification>;
  getPreferences(accountId: string): Promise<Preference[]>;
  savePreferences(accountId: string, preferences: Preference[]): Promise<Preference[]>;
}

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const CUSTOMER_ID = import.meta.env.VITE_CUSTOMER_ID ?? "cust-001";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE}/api/v1${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Customer-Id": CUSTOMER_ID,
    },
  });
  if (!response.ok) {
    throw new Error(`Solicitud fallida (${response.status})`);
  }
  return (await response.json()) as T;
}

export const httpNotificationsApi: NotificationsApi = {
  list(accountId, status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return request(`/accounts/${encodeURIComponent(accountId)}/notifications${query}`);
  },
  markRead(id) {
    return request(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" });
  },
  getPreferences(accountId) {
    return request(`/accounts/${encodeURIComponent(accountId)}/notification-preferences`);
  },
  savePreferences(accountId, preferences) {
    return request(`/accounts/${encodeURIComponent(accountId)}/notification-preferences`, {
      method: "PUT",
      body: JSON.stringify({ preferences }),
    });
  },
};
