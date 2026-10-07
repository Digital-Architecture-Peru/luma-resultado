import { InMemoryAccountRepository } from '../../src/adapters/InMemoryAccountRepository';
import type { AccountRepository } from '../../src/ports/AccountRepository';

/** Repositorio basado en datos ficticios, con posibilidad de sobreescribir metodos. */
export function makeRepository(overrides: Partial<AccountRepository> = {}): AccountRepository {
  const base = new InMemoryAccountRepository();
  return {
    list: (filter) => base.list(filter),
    getById: (id) => base.getById(id),
    ...overrides,
  };
}

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

export function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
