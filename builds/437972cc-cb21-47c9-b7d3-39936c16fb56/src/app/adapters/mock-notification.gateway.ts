import { Injectable } from '@angular/core';
import { CardNotification } from '../domain/card-notification.model';
import { NotificationGateway } from '../domain/notification.gateway';

const SAMPLE_NOTIFICATIONS: readonly CardNotification[] = [
  {
    id: 'n-001',
    cardAlias: 'Visa Compras',
    cardLast4: '1111',
    type: 'PURCHASE',
    severity: 'info',
    title: 'Compra aprobada',
    message: 'Consumo de 45,90 en COMERCIO DEMO.',
    createdAt: '2026-10-08T14:32:00Z',
    read: false,
  },
  {
    id: 'n-002',
    cardAlias: 'Mastercard Viajes',
    cardLast4: '2222',
    type: 'PAYMENT_DUE',
    severity: 'warning',
    title: 'Pago próximo a vencer',
    message: 'Tu pago mínimo vence en 3 días.',
    createdAt: '2026-10-07T09:00:00Z',
    read: false,
  },
  {
    id: 'n-003',
    cardAlias: 'Visa Compras',
    cardLast4: '1111',
    type: 'LIMIT_ALERT',
    severity: 'warning',
    title: 'Has usado el 85% de tu límite',
    message: 'Considera revisar tus consumos recientes.',
    createdAt: '2026-10-05T18:10:00Z',
    read: true,
  },
  {
    id: 'n-004',
    cardAlias: 'Mastercard Viajes',
    cardLast4: '2222',
    type: 'SECURITY',
    severity: 'critical',
    title: 'Intento de compra rechazado',
    message: 'Detectamos un intento inusual y lo rechazamos.',
    createdAt: '2026-10-04T22:45:00Z',
    read: false,
  },
];

/** Adaptador ficticio en memoria; no realiza llamadas de red. */
@Injectable()
export class MockNotificationGateway extends NotificationGateway {
  override list(): Promise<CardNotification[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(SAMPLE_NOTIFICATIONS.map((n) => ({ ...n }))), 150);
    });
  }
}
