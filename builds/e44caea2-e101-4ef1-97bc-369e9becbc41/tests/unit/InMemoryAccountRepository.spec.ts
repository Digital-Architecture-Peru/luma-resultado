import { describe, expect, it } from 'vitest';
import { InMemoryAccountRepository } from '../../src/adapters/InMemoryAccountRepository';
import type { AccountTypeOption } from '../../src/domain/account';
import { fixtureAccounts } from '../../src/fixtures/accounts';

describe('InMemoryAccountRepository', () => {
  it('given no filter, when listing, then it returns every account', async () => {
    const repo = new InMemoryAccountRepository();
    const result = await repo.list();
    expect(result).toHaveLength(fixtureAccounts.length);
  });

  it('given type SAVINGS, when listing, then only savings accounts are returned', async () => {
    const repo = new InMemoryAccountRepository();
    const result = await repo.list({ type: 'SAVINGS' });
    const expected = fixtureAccounts.filter((a) => a.type === 'SAVINGS');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toHaveLength(expected.length);
    expect(result.every((a) => a.type === 'SAVINGS')).toBe(true);
  });

  it('given type ALL, when listing, then it behaves like no filter', async () => {
    const repo = new InMemoryAccountRepository();
    expect(await repo.list({ type: 'ALL' })).toHaveLength(fixtureAccounts.length);
  });

  it('given an unsupported type, when listing, then it rejects with RangeError', async () => {
    const repo = new InMemoryAccountRepository();
    await expect(repo.list({ type: 'LOAN' as AccountTypeOption })).rejects.toBeInstanceOf(RangeError);
  });

  it('given an existing id, when getById, then it returns that account', async () => {
    const repo = new InMemoryAccountRepository();
    const account = await repo.getById('acc-001');
    expect(account?.alias).toBe('Ahorros personales');
  });

  it('given an unknown or blank id, when getById, then it returns null', async () => {
    const repo = new InMemoryAccountRepository();
    expect(await repo.getById('no-existe')).toBeNull();
    expect(await repo.getById('   ')).toBeNull();
  });

  it('given a returned account, when mutated, then the store is not affected', async () => {
    const repo = new InMemoryAccountRepository();
    const first = await repo.getById('acc-001');
    (first as { alias: string }).alias = 'MODIFICADO';
    const second = await repo.getById('acc-001');
    expect(second?.alias).toBe('Ahorros personales');
  });

  it('given a custom dataset, when listing, then it returns an empty array if there is no data', async () => {
    const repo = new InMemoryAccountRepository([]);
    expect(await repo.list()).toEqual([]);
  });
});
