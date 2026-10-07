import { describe, expect, it } from 'vitest';
import { usePayment } from '../src/composables/usePayment';
import { InMemoryPaymentGateway, type PaymentGateway } from '../src/services/paymentGateway';
import type { PaymentFormValues } from '../src/domain/payment';

const valid: PaymentFormValues = { sourceAccountId: 'acc-1', beneficiaryId: 'ben-1', amount: '200', concept: 'Luz' };

describe('usePayment', () => {
  it('given valid form when submitted then succeeds, stores receipt and refreshes balance', async () => {
    const payment = usePayment(new InMemoryPaymentGateway());
    await payment.load();

    const ok = await payment.submit(valid);

    expect(ok).toBe(true);
    expect(payment.status.value).toBe('success');
    expect(payment.receipt.value?.reference).toBe('PAG-000001');
    expect(payment.history.value).toHaveLength(1);
    expect(payment.accounts.value.find((a) => a.id === 'acc-1')?.balance).toBe(5000.75);
  });

  it('given invalid form when submitted then sets errors and does not call gateway', async () => {
    let calls = 0;
    const base = new InMemoryPaymentGateway();
    const gateway: PaymentGateway = {
      listAccounts: () => base.listAccounts(),
      listBeneficiaries: () => base.listBeneficiaries(),
      submit: (request) => {
        calls += 1;
        return base.submit(request);
      }
    };
    const payment = usePayment(gateway);
    await payment.load();

    const ok = await payment.submit({ ...valid, amount: '' });

    expect(ok).toBe(false);
    expect(payment.status.value).toBe('error');
    expect(payment.errors.value.amount).toBeDefined();
    expect(calls).toBe(0);
  });

  it('given gateway failure when submitted then exposes error message', async () => {
    const base = new InMemoryPaymentGateway();
    const gateway: PaymentGateway = {
      listAccounts: () => base.listAccounts(),
      listBeneficiaries: () => base.listBeneficiaries(),
      submit: () => Promise.reject(new Error('Servicio no disponible'))
    };
    const payment = usePayment(gateway);
    await payment.load();

    const ok = await payment.submit(valid);

    expect(ok).toBe(false);
    expect(payment.status.value).toBe('error');
    expect(payment.errorMessage.value).toBe('Servicio no disponible');
    expect(payment.history.value).toHaveLength(0);
  });
});

describe('InMemoryPaymentGateway', () => {
  it('given unknown beneficiary then rejects', async () => {
    const gateway = new InMemoryPaymentGateway();
    await expect(
      gateway.submit({ sourceAccountId: 'acc-1', beneficiaryId: 'nope', amount: 1, concept: 'x' })
    ).rejects.toThrow(/Beneficiario/);
  });
});
