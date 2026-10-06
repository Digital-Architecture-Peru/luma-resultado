import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { GATEWAY_LATENCY_MS, InMemoryAccountsGateway, SIMULATED_ERROR_KEYWORD } from './in-memory.gateway';
import { GatewayError, TransferRequest, toCents } from './model';

describe('InMemoryAccountsGateway', () => {
  let gateway: InMemoryAccountsGateway;

  const request = (over: Partial<TransferRequest> = {}): TransferRequest => ({
    operationId: 'op-1',
    fromId: 'acc-001',
    toId: 'acc-002',
    amountCents: 10000,
    concept: 'Pago',
    ...over,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemoryAccountsGateway, { provide: GATEWAY_LATENCY_MS, useValue: 0 }],
    });
    gateway = TestBed.inject(InMemoryAccountsGateway);
  });

  it('given seed data when listing then returns 3 fictitious accounts', async () => {
    const accounts = await firstValueFrom(gateway.listAccounts());
    expect(accounts.length).toBe(3);
  });

  it('given funds when transferring then debits origin and credits destination', async () => {
    const receipt = await firstValueFrom(gateway.transfer(request()));
    const accounts = await firstValueFrom(gateway.listAccounts());
    expect(receipt.reference).toBe('TRX-000001');
    expect(accounts.find((a) => a.id === 'acc-001')?.balanceCents).toBe(240000);
    expect(accounts.find((a) => a.id === 'acc-002')?.balanceCents).toBe(130050);
  });

  it('given insufficient funds when transferring then fails with INSUFFICIENT_FUNDS', async () => {
    await expectAsync(firstValueFrom(gateway.transfer(request({ fromId: 'acc-003', amountCents: 8001 }))))
      .toBeRejectedWith(jasmine.objectContaining({ code: 'INSUFFICIENT_FUNDS' }));
  });

  it('given same account when transferring then fails with SAME_ACCOUNT', async () => {
    await expectAsync(firstValueFrom(gateway.transfer(request({ toId: 'acc-001' }))))
      .toBeRejectedWith(jasmine.objectContaining({ code: 'SAME_ACCOUNT' }));
  });

  it('given non-positive amount when transferring then fails with INVALID_AMOUNT', async () => {
    await expectAsync(firstValueFrom(gateway.transfer(request({ amountCents: 0 }))))
      .toBeRejectedWith(jasmine.any(GatewayError));
  });

  it('given unknown account when transferring then fails with ACCOUNT_NOT_FOUND', async () => {
    await expectAsync(firstValueFrom(gateway.transfer(request({ toId: 'nope' }))))
      .toBeRejectedWith(jasmine.objectContaining({ code: 'ACCOUNT_NOT_FOUND' }));
  });

  it('given the same operationId when retried then does not debit twice', async () => {
    const first = await firstValueFrom(gateway.transfer(request()));
    const second = await firstValueFrom(gateway.transfer(request()));
    const accounts = await firstValueFrom(gateway.listAccounts());
    expect(second.reference).toBe(first.reference);
    expect(accounts.find((a) => a.id === 'acc-001')?.balanceCents).toBe(240000);
  });

  it('given the error keyword when transferring then fails with UNAVAILABLE', async () => {
    await expectAsync(firstValueFrom(gateway.transfer(request({ concept: SIMULATED_ERROR_KEYWORD }))))
      .toBeRejectedWith(jasmine.objectContaining({ code: 'UNAVAILABLE' }));
  });
});

describe('toCents', () => {
  it('converts valid decimals', () => {
    expect(toCents(10.5)).toBe(1050);
    expect(toCents(0.1 + 0.2)).toBe(30);
  });

  it('rejects more than 2 decimals and non-finite values', () => {
    expect(toCents(1.005)).toBeNull();
    expect(toCents(NaN)).toBeNull();
  });
});
