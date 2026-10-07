import { firstValueFrom } from 'rxjs';
import { InMemoryAccountsAdapter } from './in-memory-accounts.adapter';

describe('InMemoryAccountsAdapter', () => {
  const adapter = new InMemoryAccountsAdapter();

  it('given no filter when listing then returns all accounts', async () => {
    const all = await firstValueFrom(adapter.list());
    expect(all.length).toBe(5);
  });

  it('given a type filter when listing then returns only that type', async () => {
    const items = await firstValueFrom(adapter.list({ type: 'corriente' }));
    expect(items.length).toBe(2);
    expect(items.every((a) => a.type === 'corriente')).toBeTrue();
  });

  it('given any account when listing then numbers are masked', async () => {
    const all = await firstValueFrom(adapter.list());
    for (const a of all) {
      expect(a.maskedNumber).toMatch(/^•••• \d{4}$/);
    }
  });

  it('given an existing id when getById then returns the account', async () => {
    const acc = await firstValueFrom(adapter.getById('a1'));
    expect(acc?.alias).toBe('Ahorros personal');
  });

  it('given an unknown id when getById then returns undefined', async () => {
    expect(await firstValueFrom(adapter.getById('nope'))).toBeUndefined();
  });
});
