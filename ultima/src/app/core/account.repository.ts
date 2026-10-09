import { Observable } from 'rxjs';
import { Account } from './account.model';

/** Puerto de lectura de cuentas. La clase abstracta sirve como token de DI. */
export abstract class AccountRepository {
  abstract list(): Observable<Account[]>;
}
