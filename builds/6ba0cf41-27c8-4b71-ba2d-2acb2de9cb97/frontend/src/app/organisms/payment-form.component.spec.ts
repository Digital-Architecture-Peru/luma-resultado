import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentRequest } from '../core/models';
import { PaymentFormComponent } from './payment-form.component';

describe('PaymentFormComponent', () => {
  let fixture: ComponentFixture<PaymentFormComponent>;
  let component: PaymentFormComponent;
  let emitted: PaymentRequest[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PaymentFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
    component.accounts = ['00100000000001'];
    emitted = [];
    component.submitted.subscribe((r) => emitted.push(r));
    fixture.detectChanges();
  });

  it('given an empty form, when submitted, then nothing is emitted and fields are touched', () => {
    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.controls.amount.touched).toBeTrue();
  });

  it('given same source and target, when submitted, then it is blocked', () => {
    component.form.setValue({
      sourceAccountId: '00100000000001',
      beneficiaryAccount: '00100000000001',
      amount: '10',
      concept: ''
    });

    component.submit();

    expect(emitted.length).toBe(0);
    expect(component.form.errors?.['sameAccount']).toBeDefined();
  });

  it('given a valid form, when submitted, then emits a request with numeric amount', () => {
    component.form.setValue({
      sourceAccountId: '00100000000001',
      beneficiaryAccount: '00200000000002',
      amount: '150.75',
      concept: ' Servicio '
    });

    component.submit();

    expect(emitted.length).toBe(1);
    expect(emitted[0].amount).toBe(150.75);
    expect(emitted[0].concept).toBe('Servicio');
    expect(emitted[0].currency).toBe('PEN');
  });
});
