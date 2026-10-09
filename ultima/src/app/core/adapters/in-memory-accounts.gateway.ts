import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Account, Movement, TransferRequest } from '../models/account.model';
import { AccountsGateway } from '../ports/accounts.gateway';

const SEED_ACCOUNTS: readonly Account[] = [
  { id: 'acc-001', alias: 'Ahorros Sueldo', number: '191-0000001-0-11', currency: 'PEN', balance: 5400.5 },
  { id: 'acc-002', alias: 'Cuenta Corriente', number: '191-0000002-0-22', currency: 'PEN', balance: 1250 },
  { id: 'acc-003', alias: 'Ahorro Viajes', number: '191-0000003-0-33', currency: 'PEN', balance: 320.75 },
];

const toCents = (value: number): number => Math.round(value * 100);
const fromCents = (cents: number): number => cents / 100;

/** Adaptador ficticio: estado solo en memoria, sin red ni persistencia. */
@Injectable()
export class InMemoryAccountsGateway extends AccountsGateway {
  private accounts: Account[] = SEED_ACCOUNTS.map((a) => ({ ...a }));
  private movements: Movement[] = [];
  private sequence = 0;

  listAccounts(): Observable<Account[]> {
    return of(this.accounts.map((a) => ({ ...a })));
  }

  listMovements(): Observable<Movement[]> {
    return of([...this.movements]);
  }

  transfer(request: TransferRequest): Observable<Movement> {
    const source = this.accounts.find((a) => a.id === request.sourceId);
    const target = this.accounts.find((a) => a.id === request.targetId);
    if (!source || !target || source.id === target.id) {
      return throwError(() => new Error('Cuentas de la operación no válidas.'));
    }
    if (!(request.amount > 0) || toCents(request.amount) > toCents(source.balance)) {
      return throwError(() => new Error('Saldo insuficiente en la cuenta de origen.'));
    }

    const cents = toCents(request.amount);
    this.accounts = this.accounts.map((a) => {
      if (a.id === source.id) return { ...a, balance: fromCents(toCents(a.balance) - cents) };
      if (a.id === target.id) return { ...a, balance: fromCents(toCents(a.balance) + cents) };
      return a;
    });

    this.sequence += 1;
    const movement: Movement = {
      reference: `TRX-${String(this.sequence).padStart(6, '0')}`,
      date: new Date().toISOString(),
      sourceId: source.id,
      targetId: target.id,
      amount: fromCents(cents),
      concept: request.concept.trim(),
    };
    this.movements = [movement, ...this.movements];
    return of(movement);
  }
}
