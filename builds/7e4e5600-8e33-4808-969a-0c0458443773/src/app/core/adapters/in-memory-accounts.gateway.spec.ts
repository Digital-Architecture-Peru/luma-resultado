import { firstValueFrom } from 'rxjs';
import { InMemoryAccountsGateway } from './in-memory-accounts.gateway';

describe('InMemoryAccountsGateway', () => {
  let gateway: InMemoryAccountsGateway;

  beforeEach(() => {
    gateway = new InMemoryAccountsGateway();
  });

  it('given a valid transfer when executed then balances move and movement is recorded', async () => {
    const before = await firstValueFrom(gateway.listAccounts());
    const movement = await firstValueFrom(
      gateway.transfer({ sourceId: 'acc-001', targetId: 'acc-002', amount: 100.1, concept: ' Pago ' }),
    );
    const after = await firstValueFrom(gateway.listAccounts());

    expect(movement.reference).toBe('TRX-000001');
    expect(movement.concept).toBe('Pago');
    expect(after.find((a) => a.id === 'acc-001')?.balance).toBe(
      Math.round(((before[0].balance - 100.1) * 100)) / 100,
    );
    expect(after.find((a) => a.id === 'acc-002')?.balance).toBe(1350.1);
    expect(await firstValueFrom(gateway.listMovements())).toHaveLength(1);
  });

  it('given insufficient funds when executed then fails without changing balances', async () => {
    await expect(
      firstValueFrom(gateway.transfer({ sourceId: 'acc-003', targetId: 'acc-001', amount: 9999, concept: '' })),
    ).rejects.toThrow('insuficiente');
    const accounts = await firstValueFrom(gateway.listAccounts());
    expect(accounts.find((a) => a.id === 'acc-003')?.balance).toBe(320.75);
  });

  it('given unknown or identical accounts when executed then fails', async () => {
    await expect(
      firstValueFrom(gateway.transfer({ sourceId: 'acc-001', targetId: 'acc-001', amount: 1, concept: '' })),
    ).rejects.toThrow('no válidas');
    await expect(
      firstValueFrom(gateway.transfer({ sourceId: 'x', targetId: 'acc-001', amount: 1, concept: '' })),
    ).rejects.toThrow('no válidas');
  });
});
