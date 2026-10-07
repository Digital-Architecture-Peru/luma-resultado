import type { CardNotification } from '../model/notification';

/** Puerto de integración (sin definir): se sustituirá por un adaptador HTTP real. */
export interface NotificationGateway {
  list(): Promise<CardNotification[]>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
}

export const SAMPLE_NOTIFICATIONS: readonly CardNotification[] = [
  {
    id: 'n-1',
    cardLast4: '4321',
    type: 'purchase',
    message: 'Compra de $45.90 en Supermercado Ejemplo.',
    createdAt: '2026-10-07T09:15:00Z',
    read: false,
  },
  {
    id: 'n-2',
    cardLast4: '4321',
    type: 'limit',
    message: 'Has usado el 85% de tu límite de crédito.',
    createdAt: '2026-10-06T18:40:00Z',
    read: false,
  },
  {
    id: 'n-3',
    cardLast4: '9876',
    type: 'payment_due',
    message: 'Tu pago mínimo vence en 3 días.',
    createdAt: '2026-10-05T08:00:00Z',
    read: true,
  },
  {
    id: 'n-4',
    cardLast4: '9876',
    type: 'blocked',
    message: 'Tu tarjeta fue bloqueada temporalmente por seguridad.',
    createdAt: '2026-10-01T22:10:00Z',
    read: true,
  },
];

/** Implementación en memoria con datos ficticios (persistencia sin definir). */
export class InMemoryNotificationGateway implements NotificationGateway {
  private items: CardNotification[];

  constructor(seed: readonly CardNotification[] = SAMPLE_NOTIFICATIONS) {
    this.items = seed.map((n) => ({ ...n }));
  }

  async list(): Promise<CardNotification[]> {
    return this.items.map((n) => ({ ...n }));
  }

  async markRead(id: string): Promise<void> {
    const target = this.items.find((n) => n.id === id);
    if (!target) {
      throw new Error(`Notificación no encontrada: ${id}`);
    }
    target.read = true;
  }

  async markAllRead(): Promise<void> {
    this.items.forEach((n) => {
      n.read = true;
    });
  }
}
