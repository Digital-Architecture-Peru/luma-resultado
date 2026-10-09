import { TestBed } from '@angular/core/testing';
import { Account, PaymentSubmission } from '../models/payment.models';
import { PaymentFormComponent } from './payment-form.component';

const ACCOUNTS: Account[] = [{ id: 'a1', number: 'EC00-1000-0001', currency: 'USD', balance: 500 }];

function setup() {
  const fixture = TestBed.createComponent(PaymentFormComponent);
  fixture.componentRef.setInput('accounts', ACCOUNTS);
  fixture.detectChanges();
  const component = fixture.componentInstance;
  const emitted: PaymentSubmission[] = [];
  component.submitPayment.subscribe((s) => emitted.push(s));
  return { fixture, component, emitted };
}

describe('PaymentFormComponent', () => {
  it('given empty form when submit then does not emit and marks fields touched', () => {
    const { component, emitted } = setup();

    component.submit();

    expect(emitted).toHaveLength(0);
    expect(component.errorOf('targetAccount')).toBe('Este campo es obligatorio');
  });

  it('given amount of zero when submit then does not emit', () => {
    const { component, emitted } = setup();
    component.form.patchValue({ sourceAccountId: 'a1', targetAccount: 'EC00-9999-0001', amount: 0 });

    component.submit();

    expect(emitted).toHaveLength(0);
    expect(component.errorOf('amount')).toBe('El monto debe ser mayor a 0');
  });

  it('given valid data when submit then emits request with account currency and key', () => {
    const { component, emitted } = setup();
    component.form.patchValue({
      sourceAccountId: 'a1',
      targetAccount: ' EC00-9999-0001 ',
      amount: 25.5,
      reference: 'Renta',
    });

    component.submit();

    expect(emitted).toHaveLength(1);
    expect(emitted[0].request).toEqual({
      sourceAccountId: 'a1',
      targetAccount: 'EC00-9999-0001',
      amount: 25.5,
      currency: 'USD',
      reference: 'Renta',
    });
    expect(emitted[0].idempotencyKey.length).toBeGreaterThan(0);
  });

  it('given a retry when submit twice then reuses the same idempotency key', () => {
    const { component, emitted } = setup();
    component.form.patchValue({ sourceAccountId: 'a1', targetAccount: 'EC00-9999-0001', amount: 5 });

    component.submit();
    component.submit();

    expect(emitted[0].idempotencyKey).toBe(emitted[1].idempotencyKey);
  });

  it('given busy when submit then does not emit', () => {
    const { fixture, component, emitted } = setup();
    fixture.componentRef.setInput('busy', true);
    component.form.patchValue({ sourceAccountId: 'a1', targetAccount: 'EC00-9999-0001', amount: 5 });

    component.submit();

    expect(emitted).toHaveLength(0);
  });
});
