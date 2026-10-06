import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, TransferReceipt, TransferRequest } from './model';

/** Puerto de acceso a cuentas. Hoy solo existe el adaptador en memoria (integración: Ninguna). */
export interface AccountsGateway {
  listAccounts(): Observable<Account[]>;
  transfer(request: TransferRequest): Observable<TransferReceipt>;
}

export const ACCOUNTS_GATEWAY = new InjectionToken<AccountsGateway>('ACCOUNTS_GATEWAY');
