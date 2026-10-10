import type { PaymentNotification } from '../types/notification';
import type { NotificationsApi } from './notificationsApi';

const hoursAgo = (hours: number): string => new Date(Date.now() - hours * 3_600_000).toISOString();

export function sampleNotifications(): PaymentNotification[] {
  return [
    { id: 'n-1', paymentRef: '****1234', type: 'PAYMENT_DONE', title: 'Pago realizado', body: 'Tu pago de servicios fue procesado.', amount: 120.5, currency: 'PEN', createdAt: hoursAgo(2), readAt: null },
    { id: 'n-2', paymentRef: '****5678', type: 'PAYMENT_REJECTED', title: 'Pago rechazado', body: 'Fondos insuficientes en la cuenta origen.', amount: 1250, currency: 'USD', createdAt: hoursAgo(26), readAt: null },
    { id: 'n-3', paymentRef: '****9012', type: 'PAYMENT_DUE', title: 'Pago por vencer', body: 'Tu cuota vence en 3 días.', amount: 340, currency: 'PEN', createdAt: hoursAgo(48), readAt: null },
    { id: 'n-4', paymentRef: '****3456', type: 'PAYMENT_DONE', title: 'Transferencia completada', body: 'Transferencia entre cuentas completada.', amount: 80, currency: 'PEN', createdAt: hoursAgo(120), readAt: hoursAgo(96) },
  ];
}

export function createMockApi(seed: PaymentNotification[] = sampleNotifications()): NotificationsApi {
  let items = seed.map((n) => ({ ...n }));
  const sorted = () => [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    async list(filter) {
      const selected = sorted().filter((n) => filter === 'all' || n.readAt === null);
      return { items: selected, total: selected.length, page: 1, size: selected.length };
    },
    async unreadCount() {
      return items.filter((n) => n.readAt === null).length;
    },
    async markAsRead(id) {
      const found = items.find((n) => n.id === id);
      if (!found) throw new Error('Notificación no encontrada');
      if (found.readAt === null) {
        found.readAt = new Date().toISOString();
        items = items.map((n) => (n.id === id ? found : n));
      }
      return { ...found };
    },
  };
}
