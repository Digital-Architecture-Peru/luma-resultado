import { TestBed } from '@angular/core/testing';
import { InMemoryPaymentGateway } from './in-memory-payment.gateway';
import { PaymentGateway } from './payment.gateway';
import { PaymentsFacade } from './payments.facade';

describe('PaymentsFacade', () => {
  let facade: PaymentsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PaymentGateway, useClass: InMemoryPaymentGateway }],
    });
    facade = TestBed.inject(PaymentsFacade);
  });

  it('given accounts loaded when paying then sets success feedback and history', async () => {
    await facade.load();
    const ok = await facade.pay({ sourceAccountId: 'ACC-001', beneficiary: 'Telefonía', amount: '10', concept: '' });

    expect(ok).toBe(true);
    expect(facade.feedback()?.kind).toBe('success');
    expect(facade.history()).toHaveLength(1);
    expect(facade.busy()).toBe(false);
  });

  it('given an invalid draft when paying then sets error feedback', async () => {
    await facade.load();
    const ok = await facade.pay({ sourceAccountId: 'ACC-001', beneficiary: '', amount: '10', concept: '' });

    expect(ok).toBe(false);
    expect(facade.feedback()?.kind).toBe('error');
    expect(facade.history()).toHaveLength(0);
  });
});
