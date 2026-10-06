import { TestBed } from '@angular/core/testing';
import { ACCOUNTS_GATEWAY } from '../../../core/accounts/accounts.gateway';
import { GATEWAY_LATENCY_MS, InMemoryAccountsGateway } from '../../../core/accounts/in-memory.gateway';
import { TransferDraft } from '../../../core/accounts/model';
import { TransferStore } from './transfer.store';

describe('TransferStore', () => {
  let store: TransferStore;

  const draft = (over: Partial<TransferDraft> = {}): TransferDraft => ({
    fromId: 'acc-001',
    toId: 'acc-002',
    amountCents: 5000,
    concept: 'Ahorro',
    ...over,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferStore,
        InMemoryAccountsGateway,
        { provide: ACCOUNTS_GATEWAY, useExisting: InMemoryAccountsGateway },
        { provide: GATEWAY_LATENCY_MS, useValue: 0 },
      ],
    });
    store = TestBed.inject(TransferStore);
    store.load();
  });

  it('given load then accounts are available and loading is false', () => {
    expect(store.accounts().length).toBe(3);
    expect(store.loading()).toBeFalse();
  });

  it('given a draft when reviewing then moves to confirm step', () => {
    store.review(draft());
    expect(store.step()).toBe('confirm');
    expect(store.fromAccount()?.alias).toBe('Cuenta Sueldo');
    expect(store.toAccount()?.alias).toBe('Ahorros');
  });

  it('given confirm then produces receipt and refreshes balances', () => {
    store.review(draft());
    store.confirm();
    expect(store.step()).toBe('receipt');
    expect(store.receipt()?.amountCents).toBe(5000);
    expect(store.accounts().find((a) => a.id === 'acc-001')?.balanceCents).toBe(245000);
    expect(store.submitting()).toBeFalse();
  });

  it('given gateway failure then stays in confirm with error message', () => {
    store.review(draft({ concept: 'simular-error' }));
    store.confirm();
    expect(store.step()).toBe('confirm');
    expect(store.error()).toContain('no está disponible');
    expect(store.submitting()).toBeFalse();
  });

  it('given insufficient funds then shows the gateway message', () => {
    store.review(draft({ fromId: 'acc-003', amountCents: 999999 }));
    store.confirm();
    expect(store.error()).toBe('Saldo insuficiente en la cuenta de origen.');
  });

  it('given confirm step when going back then returns to capture and clears error', () => {
    store.review(draft());
    store.back();
    expect(store.step()).toBe('capture');
    expect(store.error()).toBeNull();
  });

  it('given a completed transfer when reset then state is clean', () => {
    store.review(draft());
    store.confirm();
    store.reset();
    expect(store.step()).toBe('capture');
    expect(store.receipt()).toBeNull();
    expect(store.draft()).toBeNull();
  });

  it('given no draft when confirming then nothing happens', () => {
    store.confirm();
    expect(store.step()).toBe('capture');
    expect(store.receipt()).toBeNull();
  });
});
