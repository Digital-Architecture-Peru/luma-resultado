import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Account } from './account.model';
import { AccountRepository } from './account.repository';

const SIMULATED_LATENCY_MS = 300;

/** Datos ficticios; sustituir por un adaptador HTTP cuando la integración esté definida. */
export const SAMPLE_ACCOUNTS: readonly Account[] = [
  { id: 'a-001', alias: 'Sueldo', type: 'AHORROS', maskedNumber: '**** 1234', currency: 'PEN', balance: 5230.45, available: 5230.45, status: 'ACTIVA' },
  { id: 'a-002', alias: 'Gastos del hogar', type: 'CORRIENTE', maskedNumber: '**** 5678', currency: 'PEN', balance: 1820.1, available: 1320.1, status: 'ACTIVA' },
  { id: 'a-003', alias: 'Viajes', type: 'AHORROS', maskedNumber: '**** 9012', currency: 'USD', balance: 950.0, available: 950.0, status: 'ACTIVA' },
  { id: 'a-004', alias: 'Depósito 12 meses', type: 'PLAZO_FIJO', maskedNumber: '**** 3456', currency: 'USD', balance: 10000, available: 0, status: 'ACTIVA' },
  { id: 'a-005', alias: 'Cuenta antigua', type: 'CORRIENTE', maskedNumber: '**** 7788', currency: 'PEN', balance: 0, available: 0, status: 'INACTIVA' },
  { id: 'a-006', alias: 'Negocio', type: 'CORRIENTE', maskedNumber: '**** 2211', currency: 'PEN', balance: 450.9, available: 0, status: 'BLOQUEADA' },
];

@Injectable()
export class InMemoryAccountRepository extends AccountRepository {
  override list(): Observable<Account[]> {
    return of([...SAMPLE_ACCOUNTS]).pipe(delay(SIMULATED_LATENCY_MS));
  }
}
