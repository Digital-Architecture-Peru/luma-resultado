import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AccountNotification } from '../domain/notification.model';
import { NotificationRepository } from '../domain/notification.repository';

const SEED: readonly AccountNotification[] = [
  {
    id: 'n-001',
    accountAlias: 'Cuenta de ahorros ****1234',
    kind: 'low-balance',
    title: 'Saldo por debajo del mínimo',
    message: 'El saldo disponible es inferior al mínimo configurado de 100.00.',
    createdAt: '2026-10-09T08:15:00-05:00',
    read: false,
  },
  {
    id: 'n-002',
    accountAlias: 'Cuenta corriente ****5678',
    kind: 'deposit',
    title: 'Depósito recibido',
    message: 'Se acreditó un depósito de 450.00 (dato ficticio).',
    createdAt: '2026-10-08T17:40:00-05:00',
    read: false,
  },
  {
    id: 'n-003',
    accountAlias: 'Cuenta de ahorros ****1234',
    kind: 'withdrawal',
    title: 'Retiro en cajero',
    message: 'Retiro de 80.00 en cajero automático (dato ficticio).',
    createdAt: '2026-10-07T11:05:00-05:00',
    read: true,
  },
  {
    id: 'n-004',
    accountAlias: 'Cuenta corriente ****5678',
    kind: 'security',
    title: 'Nuevo inicio de sesión',
    message: 'Se detectó un inicio de sesión desde un dispositivo nuevo.',
    createdAt: '2026-10-06T21:30:00-05:00',
    read: true,
  },
];

/** Adaptador con datos ficticios; sin red ni persistencia. */
@Injectable()
export class InMemoryNotificationRepository extends NotificationRepository {
  override list(): Observable<AccountNotification[]> {
    return of([...SEED]).pipe(delay(250));
  }
}
