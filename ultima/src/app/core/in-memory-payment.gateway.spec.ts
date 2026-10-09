import { InMemoryPaymentGateway } from './in-memory-payment.gateway';
import { PaymentRejectedError } from './payment.gateway';
import { PaymentDraft } from './payment.model';

const draft: PaymentDraft = { sourceAccountId: 'ACC-002', beneficiary: 'Agua Potable', amount: '200.25', concept: '' };

describe('InMemoryPaymentGateway', () => {
  it('given a valid draft when submitting then debits the account and records the payment', async () => {
    const gateway = new InMemoryPaymentGateway();
    const payment = await gateway.submit(draft);

    expect(payment.id).toBe('PAY-00001');
    expect(payment.amount).toBe(200.25);
    const account = (await gateway.listAccounts()).find((a) => a.id === 'ACC-002');
    expect(account?.balance).toBe(999.75);
    expect(await gateway.listPayments()).toHaveLength(1);
  });

  it('given insufficient funds when submitting then rejects and changes nothing', async () => {
    const gateway = new InMemoryPaymentGateway();
    await expect(gateway.submit({ ...draft, amount: '5000' })).rejects.toBeInstanceOf(PaymentRejectedError);
    expect(await gateway.listPayments()).toHaveLength(0);
  });
});
