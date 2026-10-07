import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Account, AccountsFilter, AccountStatus, AccountType } from './account.model';
import { AccountsQueryPort } from './accounts-query.port';
import { maskAccountNumber } from './mask-account.pipe';

interface RawAccount {
  id: string;
  alias: string;
  number: string; // ficticio; solo existe en este adaptador
  type: AccountType;
  currency: string;
  availableBalance: number;
  status: AccountStatus;
}

// Datos FICTICIOS.
const RAW_ACCOUNTS: readonly RawAccount[] = [
  { id: 'a1', alias: 'Ahorros personal', number: '0011112222', type: 'ahorros', currency: 'USD', availableBalance: 2450.75, status: 'activa' },
  { id: 'a2', alias: 'Nómina', number: '0033334444', type: 'corriente', currency: 'USD', availableBalance: 1320.1, status: 'activa' },
  { id: 'a3', alias: 'Fondo de viaje', number: '0055556666', type: 'ahorros', currency: 'USD', availableBalance: 780, status: 'activa' },
  { id: 'a4', alias: 'Gastos del negocio', number: '0077778888', type: 'corriente', currency: 'USD', availableBalance: 15.5, status: 'bloqueada' },
  { id: 'a5', alias: 'Ahorros antiguos', number: '0099990000', type: 'ahorros', currency: 'USD', availableBalance: 0, status: 'inactiva' },
];

function toAccount(raw: RawAccount): Account {
  return {
    id: raw.id,
    alias: raw.alias,
    maskedNumber: maskAccountNumber(raw.number),
    type: raw.type,
    currency: raw.currency,
    availableBalance: raw.availableBalance,
    status: raw.status,
  };
}

@Injectable()
export class InMemoryAccountsAdapter implements AccountsQueryPort {
  list(filter?: AccountsFilter): Observable<Account[]> {
    const items = RAW_ACCOUNTS.filter((a) => !filter?.type || a.type === filter.type).map(toAccount);
    return of(items);
  }

  getById(id: string): Observable<Account | undefined> {
    const raw = RAW_ACCOUNTS.find((a) => a.id === id);
    return of(raw ? toAccount(raw) : undefined);
  }
}
