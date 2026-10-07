import { describe, expect, it } from 'vitest';
import { TransactionError } from '../src/domain/types';
import { createInMemoryGateway } from '../src/services/transactionGateway';

const fixedNow = () => new Date('2026-01-01T10:00:00.000Z');

describe('in-memory gateway', () => {
  it('given valid input when submit then approves, discounts balance and lists it', async () => {
    const gateway = createInMemoryGateway(fixedNow);
    const tx = await gateway.submit({ cardId: 'c1', amount: 100.25, merchant: 'Tienda' });

    expect(tx.status).toBe('approved');
    expect(tx.createdAt).toBe('2026-01-01T10:00:00.000Z');
    const cards = await gateway.listCards();
    expect(cards.find((c) => c.id === 'c1')?.available).toBe(1399.75);
    expect(await gateway.listTransactions()).toHaveLength(1);
  });

  it('given amount above balance when submit then rejects with TransactionError', async () => {
    const gateway = createInMemoryGateway(fixedNow);
    await expect(gateway.submit({ cardId: 'c2', amount: 9999, merchant: 'X' })).rejects.toBeInstanceOf(
      TransactionError,
    );
    expect(await gateway.listTransactions()).toHaveLength(0);
  });

  it('given blocked card when submit then rejects', async () => {
    const gateway = createInMemoryGateway(fixedNow);
    await expect(gateway.submit({ cardId: 'c3', amount: 1, merchant: 'X' })).rejects.toThrow('bloqueada');
  });
});
