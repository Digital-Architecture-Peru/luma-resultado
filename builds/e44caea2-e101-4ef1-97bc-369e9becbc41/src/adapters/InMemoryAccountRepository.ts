import { isAccountTypeOption } from '../domain/account';
import type { Account, AccountFilter } from '../domain/account';
import { fixtureAccounts } from '../fixtures/accounts';
import type { AccountRepository } from '../ports/AccountRepository';

/** Adaptador en memoria (solo lectura) con datos ficticios. */
export class InMemoryAccountRepository implements AccountRepository {
  private readonly accounts: readonly Account[];

  constructor(
    accounts: readonly Account[] = fixtureAccounts,
    private readonly latencyMs = 0,
  ) {
    // Copias defensivas: los consumidores no pueden mutar el almacen.
    this.accounts = accounts.map((account) => ({ ...account }));
  }

  async list(filter: AccountFilter = {}): Promise<Account[]> {
    const type = filter.type ?? 'ALL';
    if (!isAccountTypeOption(type)) {
      throw new RangeError('Tipo de cuenta no soportado.');
    }
    await this.delay();
    return this.accounts
      .filter((account) => type === 'ALL' || account.type === type)
      .map((account) => ({ ...account }));
  }

  async getById(id: string): Promise<Account | null> {
    if (typeof id !== 'string' || id.trim() === '') {
      return null;
    }
    await this.delay();
    const found = this.accounts.find((account) => account.id === id);
    return found ? { ...found } : null;
  }

  private delay(): Promise<void> {
    if (this.latencyMs <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }
}
