import type { NotificationStatus, PaymentNotification } from '../types/notification';

export interface NotificationsApi {
  list(status?: NotificationStatus): Promise<PaymentNotification[]>;
  markAsRead(id: number): Promise<PaymentNotification>;
}

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';
// Identidad simulada: la autenticación real está pendiente.
const CUSTOMER_ID: string = import.meta.env.VITE_CUSTOMER_ID ?? 'CUST-001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}/api/v1/notifications${path}`, {
    ...init,
    headers: { 'X-Customer-Id': CUSTOMER_ID, 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar notificaciones`);
  }
  return (await response.json()) as T;
}

export const notificationsApi: NotificationsApi = {
  list: (status) => request<PaymentNotification[]>(status ? `?status=${status}` : ''),
  markAsRead: (id) => request<PaymentNotification>(`/${id}/read`, { method: 'PATCH' }),
};
