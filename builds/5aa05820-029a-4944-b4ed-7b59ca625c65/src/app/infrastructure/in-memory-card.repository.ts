import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Card } from '../domain/card.model';
import { CardRepository } from '../domain/card.repository';

const SAMPLE_CARDS: readonly Card[] = [
  { id: 'c-001', holder: 'Distribuidora Andina S.A.S.', last4: '4821', brand: 'Visa', status: 'ACTIVE', expiry: '08/28', creditLimit: 20000, balance: 5400.5, currency: 'USD' },
  { id: 'c-002', holder: 'Logística Pacífico Ltda.', last4: '1093', brand: 'Mastercard', status: 'BLOCKED', expiry: '03/27', creditLimit: 12000, balance: 11890, currency: 'USD' },
  { id: 'c-003', holder: 'Constructora Horizonte', last4: '7755', brand: 'Visa', status: 'EXPIRED', expiry: '01/25', creditLimit: 8000, balance: 0, currency: 'USD' },
  { id: 'c-004', holder: 'Servicios Médicos del Valle', last4: '3310', brand: 'Amex', status: 'ACTIVE', expiry: '11/29', creditLimit: 30000, balance: 1250.75, currency: 'USD' },
];

/** Datos ficticios; sustituir por un adaptador real cuando se defina la integración. */
@Injectable()
export class InMemoryCardRepository extends CardRepository {
  override list(): Observable<Card[]> {
    return of([...SAMPLE_CARDS]);
  }
}
