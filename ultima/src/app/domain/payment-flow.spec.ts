import { describe, expect, it } from 'vitest';
import { Account, Card, PaymentReceipt, PaymentRequest } from './models';
import { InMemoryPaymentGateway, PaymentGateway } from './payment-gateway';
import { PaymentFlow } from './payment-flow';

async function loadedFlow(): Promise<PaymentFlow> {
  const flow = new PaymentFlow(new InMemoryPaymentGateway(() => new Date('2026-01-15T10:00:00.000Z')));
  await flow.load();
  return flow;
}

class FailingGateway extends PaymentGateway {
  async listCards(): Promise<Card[]> {
    throw new Error('down');
  }
  async listAccounts(): Promise<Account[]> {
    throw new Error('down');
  }
  async pay(_request: PaymentRequest): Promise<PaymentReceipt> {
    throw new Error('down');
  }
}

describe('PaymentFlow', () => {
  it('given a gateway when loading then exposes cards and accounts', async () => {
    const flow = await loadedFlow();
    expect(flow.cards()).toHaveLength(3);
    expect(flow.accounts()).toHaveLength(2);
    expect(flow.loading()).toBe(false);
  });

  it('given a failing gateway when loading then sets a load error', async () => {
    const flow = new PaymentFlow(new FailingGateway());
    await flow.load();
    expect(flow.loadError()).not.toBeNull();
    expect(flow.loading()).toBe(false);
  });

  it('given nothing selected when reviewing then stays on form with errors', async () => {
    const flow = await loadedFlow();
    flow.review();
    expect(flow.step()).toBe('form');
    expect(flow.errors().length).toBeGreaterThan(0);
  });

  it('given card and account selected when reviewing then moves to review with minimum amount', async () => {
    const flow = await loadedFlow();
    flow.selectCard('c1');
    flow.selectAccount('a1');
    flow.review();
    expect(flow.step()).toBe('review');
    expect(flow.amount()).toBe(85);
  });

  it('given review step when confirming then completes with a receipt and refreshed balance', async () => {
    const flow = await loadedFlow();
    flow.selectCard('c1');
    flow.selectAccount('a1');
    flow.setMode('total');
    flow.review();
    await flow.confirm();
    expect(flow.step()).toBe('done');
    expect(flow.receipt()?.newCardBalance).toBe(0);
    expect(flow.cards().find((c) => c.id === 'c1')?.balance).toBe(0);
  });

  it('given insufficient funds when reviewing then rejects without calling the gateway', async () => {
    const flow = await loadedFlow();
    flow.selectCard('c1');
    flow.selectAccount('a2');
    flow.setMode('custom');
    flow.setCustomAmount(1000);
    flow.review();
    expect(flow.step()).toBe('form');
    expect(flow.errors()).toContain('Saldo insuficiente en la cuenta de origen.');
  });

  it('given a failing payment when confirming then returns to form with an error', async () => {
    const flow = await loadedFlow();
    flow.selectCard('c1');
    flow.selectAccount('a1');
    flow.review();
    (flow as unknown as { gateway: PaymentGateway }).gateway = new FailingGateway();
    await flow.confirm();
    expect(flow.step()).toBe('form');
    expect(flow.errors()).toEqual(['No se pudo procesar el pago.']);
  });

  it('given a finished payment when resetting then clears the selection', async () => {
    const flow = await loadedFlow();
    flow.selectCard('c2');
    flow.selectAccount('a1');
    flow.review();
    await flow.confirm();
    flow.reset();
    expect(flow.step()).toBe('form');
    expect(flow.cardId()).toBeNull();
    expect(flow.receipt()).toBeNull();
    expect(flow.mode()).toBe('minimum');
  });
});
