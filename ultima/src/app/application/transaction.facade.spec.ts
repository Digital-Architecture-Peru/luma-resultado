import { describe, expect, it } from 'vitest';
import { InMemoryCardGateway } from '../adapters/in-memory-card.gateway';
import { Card } from '../domain/card';
import { CardGateway } from '../domain/card.gateway';
import { TransactionRequest } from '../domain/transaction';
import { GENERIC_ERROR, TransactionFacade } from './transaction.facade';

const cards: readonly Card[] = [
  { id: 'blocked', alias: 'B', brand: 'VISA', last4: '1111', status: 'BLOCKED', creditLimitCents: 1000, availableCents: 1000 },
  { id: 'ok', alias: 'A', brand: 'VISA', last4: '2222', status: 'ACTIVE', creditLimitCents: 100000, availableCents: 60000 },
];

const FIXED_DATE = new Date('2026-01-01T00:00:00.000Z');

function createFacade(): TransactionFacade {
  return new TransactionFacade(new InMemoryCardGateway(cards, () => FIXED_DATE));
}

function request(overrides: Partial<TransactionRequest> = {}): TransactionRequest {
  return { cardId: 'ok', type: 'PAYMENT', amountCents: 10000, description: ' pago ', ...overrides };
}

describe('TransactionFacade', () => {
  it('given cards when loading then selects the first active card', async () => {
    const facade = createFacade();
    await facade.load();
    expect(facade.cards()).toHaveLength(2);
    expect(facade.selectedCard()?.id).toBe('ok');
    expect(facade.loading()).toBe(false);
  });

  it('given a valid payment when submitting then records receipt and updates balance', async () => {
    const facade = createFacade();
    await facade.load();
    await facade.submit(request());
    const receipt = facade.lastReceipt();
    expect(receipt?.reference).toBe('TRX-000001');
    expect(receipt?.description).toBe('pago');
    expect(receipt?.at).toBe(FIXED_DATE.toISOString());
    expect(facade.selectedCard()?.availableCents).toBe(70000);
    expect(facade.error()).toBeNull();
  });

  it('given an invalid request when submitting then exposes the domain error and no receipt', async () => {
    const facade = createFacade();
    await facade.load();
    await facade.submit(request({ amountCents: 999999 }));
    expect(facade.error()).toContain('deuda');
    expect(facade.history()).toHaveLength(0);
    expect(facade.submitting()).toBe(false);
  });

  it('given a blocked card when submitting then is rejected', async () => {
    const facade = createFacade();
    await facade.load();
    facade.select('blocked');
    await facade.submit(request({ cardId: 'blocked' }));
    expect(facade.error()).toContain('bloqueada');
  });

  it('given an unexpected gateway failure then shows a generic message', async () => {
    class FailingGateway extends CardGateway {
      async listCards(): Promise<readonly Card[]> {
        return cards;
      }
      async execute(): Promise<never> {
        throw new Error('boom');
      }
    }
    const facade = new TransactionFacade(new FailingGateway());
    await facade.load();
    await facade.submit(request());
    expect(facade.error()).toBe(GENERIC_ERROR);
  });

  it('given a failing load then shows a generic message', async () => {
    class BrokenGateway extends CardGateway {
      async listCards(): Promise<readonly Card[]> {
        throw new Error('down');
      }
      async execute(): Promise<never> {
        throw new Error('down');
      }
    }
    const facade = new TransactionFacade(new BrokenGateway());
    await facade.load();
    expect(facade.error()).toBe(GENERIC_ERROR);
    expect(facade.loading()).toBe(false);
  });
});
