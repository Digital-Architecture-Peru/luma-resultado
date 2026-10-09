import { Observable } from 'rxjs';
import { Account, Movement, TransferRequest } from '../models/account.model';

/** Puerto de acceso a cuentas. La integración real está sin definir. */
export abstract class AccountsGateway {
  abstract listAccounts(): Observable<Account[]>;
  abstract listMovements(): Observable<Movement[]>;
  abstract transfer(request: TransferRequest): Observable<Movement>;
}
