import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotificationGateway } from '../domain/notification.gateway';
import { PaymentNotification } from '../domain/notification.model';

const SAMPLE_DATA: readonly PaymentNotification[] = [
  {
    id: 'n-001',
    kind: 'payment-received',
    title: 'Transferencia recibida',
    message: 'Recibiste un pago de Cliente Ficticio S.A.',
    amountCents: 150000,
    currency: 'PEN',
    createdAt: '2026-10-09T09:15:00-05:00',
    read: false
  },
  {
    id: 'n-002',
    kind: 'payment-failed',
    title: 'Pago rechazado',
    message: 'No se pudo procesar el pago del servicio de agua.',
    amountCents: 8950,
    currency: 'PEN',
    createdAt: '2026-10-08T18:40:00-05:00',
    read: false
  },
  {
    id: 'n-003',
    kind: 'payment-due',
    title: 'Vencimiento próximo',
    message: 'Tu cuota de préstamo vence en 3 días.',
    amountCents: 42000,
    currency: 'PEN',
    createdAt: '2026-10-07T08:00:00-05:00',
    read: true
  },
  {
    id: 'n-004',
    kind: 'payment-scheduled',
    title: 'Pago programado',
    message: 'Se programó el pago de tu tarjeta para el 15 de octubre.',
    amountCents: 120000,
    currency: 'PEN',
    createdAt: '2026-10-06T12:30:00-05:00',
    read: true
  }
];

/** Adaptador en memoria con datos ficticios; sin red. */
@Injectable()
export class MockNotificationGateway extends NotificationGateway {
  override list(): Observable<PaymentNotification[]> {
    return of(SAMPLE_DATA.map((n) => ({ ...n })));
  }
}
