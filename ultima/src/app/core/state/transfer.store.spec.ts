import { TestBed } from '@angular/core/testing';
import { AccountsGateway } from '../ports/accounts.gateway';
import { InMemoryAccountsGateway } from '../adapters/in-memory-accounts.gateway';
import { TransferStore } from './transfer.store';

describe('TransferStore', () => {
  let store: TransferStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AccountsGateway, useClass: InMemoryAccountsGateway }],
    });
    store = TestBed.inject(TransferStore);
  });

  it('given the store when loaded then exposes seeded accounts', () => {
    store.load();
    expect(store.accounts()).toHaveLength(3);
    expect(store.status()).toBe('idle');
  });

  it('given a valid request when submitted then succeeds, refreshes data and calls back', () => {
    store.load();
    const onSuccess = jest.fn();
    store.submit({ sourceId: 'acc-001', targetId: 'acc-003', amount: 400, concept: '' }, onSuccess);

    expect(store.status()).toBe('success');
    expect(store.message()).toContain('TRX-000001');
    expect(store.movements()).toHaveLength(1);
    expect(store.accounts().find((a) => a.id === 'acc-003')?.balance).toBe(720.75);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('given an invalid request when submitted then fails and does not call back', () => {
    store.load();
    const onSuccess = jest.fn();
    store.submit({ sourceId: 'acc-003', targetId: 'acc-001', amount: 5000, concept: '' }, onSuccess);

    expect(store.status()).toBe('error');
    expect(store.message()).toContain('insuficiente');
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
