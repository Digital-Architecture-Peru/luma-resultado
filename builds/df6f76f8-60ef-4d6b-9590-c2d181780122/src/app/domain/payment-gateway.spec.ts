import { describe, expect, it } from 'vitest';
import { InMemoryPaymentGateway, PaymentError } from './payment-gateway';

const fixedNow = () => new Date('2026-01-15T10:00:00.000Z');

describe('InMemoryPaymentGateway', () => {
  it('given a valid payment when paying then returns a receipt and updates balances', async () => {
    const gateway = new InMemoryPaymentGateway(fixedNow);
    const receipt = await gateway.pay({ cardId: 'c1', accountId: 'a1', amount: 250.75 });

    expect(receipt.reference).toBe('PAG-000001');
    expect(receipt.date).toBe('2026-01-15T10:00:00.000Z');
    expect(receipt.newCardBalance).toBe(1000);
    const cards = await gateway.listCards();
    const accounts = await gateway.listAccounts();
    expect(cards.find((c) => c.id === 'c1')?.balance).toBe(1000);
    expect(accounts.find((a) => a.id === 'a1')?.available).toBe(2149.25);
  });

  it('given consecutive payments when paying then references are sequential', async () => {
    const gateway = new InMemoryPaymentGateway(fixedNow);
    await gateway.pay({ cardId: 'c1', accountId: 'a1', amount: 10 });
    const second = await gateway.pay({ cardId: 'c2', accountId: 'a1', amount: 10 });
    expect(second.reference).toBe('PAG-000002');
  });

  it('given insufficient funds when paying then throws PaymentError and keeps balances', async () => {
    const gateway = new InMemoryPaymentGateway(fixedNow);
    await expect(gateway.pay({ cardId: 'c1', accountId: 'a2', amount: 1000 })).rejects.toBeInstanceOf(PaymentError);
    const accounts = await gateway.listAccounts();
    expect(accounts.find((a) => a.id === 'a2')?.available).toBe(300.5);
  });

  it('given a blocked card when paying then rejects', async () => {
    const gateway = new InMemoryPaymentGateway(fixedNow);
    await expect(gateway.pay({ cardId: 'c3', accountId: 'a1', amount: 10 })).rejects.toThrow(/bloqueada/);
  });

  it('given listed cards when mutating the copy then internal state is unchanged', async () => {
    const gateway = new InMemoryPaymentGateway(fixedNow);
    const cards = await gateway.listCards();
    cards[0] = { ...cards[0]!, balance: 0 };
    expect((await gateway.listCards())[0]?.balance).toBe(1250.75);
  });
});
