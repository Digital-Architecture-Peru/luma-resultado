import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Account, TransferRequest } from '../core/models';
import { TransferFormComponent } from './transfer-form.component';

const ACCOUNTS: Account[] = [
  { id: 1, number: '0001', holder: 'Demo', currency: 'USD', balance: 100 },
  { id: 2, number: '0002', holder: 'Demo', currency: 'USD', balance: 10 },
  { id: 3, number: '0003', holder: 'Demo', currency: 'EUR', balance: 50 },
];

describe('TransferFormComponent', () => {
  let fixture: ComponentFixture<TransferFormComponent>;
  let component: TransferFormComponent;
  let emitted: TransferRequest[];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TransferFormComponent] });
    fixture = TestBed.createComponent(TransferFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('accounts', ACCOUNTS);
    emitted = [];
    component.submitted.subscribe((value) => emitted.push(value));
    fixture.detectChanges();
  });

  it('given a valid form, when submitted, then emits the transfer request', () => {
    component.form.setValue({ source: 1, target: 2, amount: '25.50', description: ' Renta ' });

    component.submit();

    expect(emitted).toEqual([
      { sourceAccountId: 1, targetAccountId: 2, amount: 25.5, currency: 'USD', description: 'Renta' },
    ]);
  });

  it('given an empty form, when submitted, then nothing is emitted', () => {
    component.submit();

    expect(emitted).toHaveLength(0);
    expect(component.error('amount')).toBe('Ingrese un monto.');
  });

  it('given the same account twice, when submitted, then shows an error and does not emit', () => {
    component.form.setValue({ source: 1, target: 1, amount: '5.00', description: '' });

    component.submit();

    expect(emitted).toHaveLength(0);
    expect(component.formError).toBe('La cuenta origen y destino deben ser distintas.');
  });

  it('given accounts with different currencies, when submitted, then shows an error', () => {
    component.form.setValue({ source: 1, target: 3, amount: '5.00', description: '' });

    component.submit();

    expect(emitted).toHaveLength(0);
    expect(component.formError).toBe('Las cuentas deben tener la misma moneda.');
  });
});
