import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Account, SubmittedTransfer } from '../core/models';
import { TransferFormComponent } from './transfer-form.component';

const ACCOUNTS: Account[] = [
  { id: 1, numberMasked: '****1001', currency: 'USD', balance: '100.00' },
  { id: 2, numberMasked: '****1002', currency: 'USD', balance: '50.00' },
];

describe('TransferFormComponent', () => {
  let fixture: ComponentFixture<TransferFormComponent>;
  let component: TransferFormComponent;
  let emitted: SubmittedTransfer[];

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFormComponent);
    component = fixture.componentInstance;
    component.accounts = ACCOUNTS;
    emitted = [];
    component.submitted.subscribe((s) => emitted.push(s));
    fixture.detectChanges();
  });

  it('given an empty form when submit then nothing is emitted and fields are touched', () => {
    component.submit();

    expect(emitted).toHaveLength(0);
    expect(component.form.controls.amount.touched).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('given same source and target when submit then sameAccount error and no emission', () => {
    component.form.patchValue({ source: 1, target: 1, amount: '10' });
    component.submit();
    fixture.detectChanges();

    expect(component.form.hasError('sameAccount')).toBe(true);
    expect(emitted).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('distinta del origen');
  });

  it.each(['0', '10.999', 'abc'])('given amount %s when submit then it is invalid', (amount) => {
    component.form.patchValue({ source: 1, target: 2, amount });
    component.submit();

    expect(component.form.controls.amount.invalid).toBe(true);
    expect(emitted).toHaveLength(0);
  });

  it('given valid data when submit then emits request with source currency and a key', () => {
    component.form.patchValue({ source: 1, target: 2, amount: ' 25.50 ', description: ' Ahorro ' });
    component.submit();

    expect(emitted).toHaveLength(1);
    expect(emitted[0].request).toEqual({
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: '25.50',
      currency: 'USD',
      description: 'Ahorro',
    });
    expect(emitted[0].idempotencyKey.length).toBeGreaterThan(0);
  });

  it('given a retry with same data when submit twice then the idempotency key is reused', () => {
    component.form.patchValue({ source: 1, target: 2, amount: '5' });
    component.submit();
    component.submit();

    expect(emitted).toHaveLength(2);
    expect(emitted[1].idempotencyKey).toBe(emitted[0].idempotencyKey);
  });

  it('given changed data when submit again then the idempotency key changes', () => {
    component.form.patchValue({ source: 1, target: 2, amount: '5' });
    component.submit();
    component.form.patchValue({ amount: '6' });
    component.submit();

    expect(emitted[1].idempotencyKey).not.toBe(emitted[0].idempotencyKey);
  });

  it('given busy true then the submit button is disabled', () => {
    component.busy = true;
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });
});
