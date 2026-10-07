import type { Account, AccountFilter } from '../domain/account';

/**
 * Puerto de solo lectura para consultar cuentas.
 * La persistencia (PostgreSQL) vive detras de un backend futuro; el frontend
 * solo depende de esta interfaz.
 */
export interface AccountRepository {
  list(filter?: AccountFilter): Promise<Account[]>;
  /** Devuelve null si la cuenta no existe. */
  getById(id: string): Promise<Account | null>;
}
