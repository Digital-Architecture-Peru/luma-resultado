import { describe, expect, it } from 'vitest';
import { InMemoryGateway, SAMPLE_CARDS } from '../src/services/inMemoryGateway';
import { TransactionError } from '../src/services/transactionGateway';

const fixedNow = (): Date => new Date('2026-01-01T00:00:00.000Z');

function request(overrides: Partial<{ cardId: string; amount: number }> = {}) {
  return { cardId: 'c1', amount: 1000, merchant: 'Proveedor', description: '', ...overrides };
}

describe('InMemoryGateway', () => {
  it('given valid request when submitted then records it and reduces limit', async () => {
    const gateway = new InMemoryGateway(SAMPLE_CARDS, fixedNow);
    const record = await gateway.submit(request());
    expect(record).toMatchObject({ id: 'tx-0001', status: 'approved', currency: 'COP', createdAt: '2026-01-01T00:00:00.000Z' });
    const cards = await gateway.listCards();
    expect(cards.find((c) => c.id === 'c1')?.availableLimit).toBe(4_999_000);
    expect(await gateway.listTransactions()).toHaveLength(1);
  });

  it('given several transactions when listed then newest first', async () => {
    const gateway = new InMemoryGateway(SAMPLE_CARDS, fixedNow);
    await gateway.submit(request({ amount: 1 }));
    await gateway.submit(request({ amount: 2 }));
    const list = await gateway.listTransactions();
    expect(list.map((r) => r.id)).toEqual(['tx-0002', 'tx-0001']);
  });

  it('given blocked card when submitted then throws TransactionError', async () => {
    const gateway = new InMemoryGateway(SAMPLE_CARDS, fixedNow);
    await expect(gateway.submit(request({ cardId: 'c3', amount: 1 }))).rejects.toBeInstanceOf(TransactionError);
  });

  it('given amount above limit when submitted then throws', async () => {
    const gateway = new InMemoryGateway(SAMPLE_CARDS, fixedNow);
    await expect(gateway.submit(request({ amount: 99_000_000 }))).rejects.toThrow('Cupo insuficiente.');
  });

  it('given unknown card when submitted then throws', async () => {
    const gateway = new InMemoryGateway(SAMPLE_CARDS, fixedNow);
    await expect(gateway.submit(request({ cardId: 'zz' }))).rejects.toThrow('Tarjeta no encontrada.');
  });
});
