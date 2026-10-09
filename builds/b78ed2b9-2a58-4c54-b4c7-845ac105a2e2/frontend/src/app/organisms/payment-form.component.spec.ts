import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentFormComponent, PaymentFormValue } from './payment-form.component';

describe('PaymentFormComponent', () => {
  let fixture: ComponentFixture<PaymentFormComponent>;
  let component: PaymentFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PaymentFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('given amount 0, when submitting, then it does not emit and shows an error', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);
    component.form.setValue({ amount: 0, sourceAccountAlias: 'Cuenta ahorro' });

    component.submit();
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Ingresa un monto mayor a 0.');
  });

  it('given more than two decimals, when submitting, then it is rejected', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);
    component.form.setValue({ amount: 10.123, sourceAccountAlias: 'Cuenta ahorro' });

    component.submit();

    expect(spy).not.toHaveBeenCalled();
    expect(component.amountError()).toBe('Máximo 2 decimales.');
  });

  it('given a valid form, when submitting, then it emits the trimmed value', () => {
    const spy = jest.fn<void, [PaymentFormValue]>();
    component.submitted.subscribe(spy);
    component.form.setValue({ amount: 150.5, sourceAccountAlias: '  Cuenta ahorro ' });

    component.submit();

    expect(spy).toHaveBeenCalledWith({ amount: 150.5, sourceAccountAlias: 'Cuenta ahorro' });
  });

  it('given a missing alias, when submitting, then it asks for the source account', () => {
    component.form.setValue({ amount: 20, sourceAccountAlias: '' });

    component.submit();

    expect(component.aliasError()).toBe('Indica el alias de la cuenta de origen.');
  });
});
