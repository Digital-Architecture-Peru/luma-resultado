import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, AccountsFilter } from './account.model';

/** Puerto de consulta de cuentas (solo lectura). */
export interface AccountsQueryPort {
  list(filter?: AccountsFilter): Observable<Account[]>;
  getById(id: string): Observable<Account | undefined>;
}

export const ACCOUNTS_QUERY = new InjectionToken<AccountsQueryPort>('ACCOUNTS_QUERY');
