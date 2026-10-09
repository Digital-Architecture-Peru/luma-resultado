import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentDraft } from '../core/payment.model';
import { PaymentFormComponent } from './payment-form.component';

describe('PaymentFormComponent', () => {
  let fixture: ComponentFixture<PaymentFormComponent>;
  let root: HTMLElement;
  let emitted: PaymentDraft[];

  // Simula la interacción real del usuario: tras cada evento el navegador
  // ejecuta detección de cambios, por lo que los bindings [value] reflejan lo escrito.
  function setValue(selector: string, value: string, eventName: string): void {
    const el = root.querySelector<HTMLInputElement | HTMLSelectElement>(selector) as HTMLInputElement;
    el.value = value;
    el.dispatchEvent(new Event(eventName));
    fixture.detectChanges();
  }

  function submit(): void {
    root.querySelector('form')?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PaymentFormComponent] });
    fixture = TestBed.createComponent(PaymentFormComponent);
    fixture.componentRef.setInput('accounts', [{ id: 'A1', name: 'Cuenta A', balance: 500 }]);
    emitted = [];
    fixture.componentInstance.submitted.subscribe((d) => emitted.push(d));
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
  });

  it('given an empty form when submitting then shows errors and emits nothing', () => {
    submit();
    expect(root.querySelectorAll('.field-error').length).toBe(3);
    expect(emitted).toHaveLength(0);
  });

  it('given valid values when submitting then emits the draft and clears the form', () => {
    setValue('#source', 'A1', 'change');
    setValue('#beneficiary', 'Gas Natural', 'input');
    setValue('#amount', '45.90', 'input');
    submit();

    expect(emitted).toEqual([{ sourceAccountId: 'A1', beneficiary: 'Gas Natural', amount: '45.90', concept: '' }]);
    expect(root.querySelectorAll('.field-error').length).toBe(0);
    expect((root.querySelector('#beneficiary') as HTMLInputElement).value).toBe('');
    expect((root.querySelector('#amount') as HTMLInputElement).value).toBe('');
  });

  it('given an amount above the balance when submitting then shows insufficient funds', () => {
    setValue('#source', 'A1', 'change');
    setValue('#beneficiary', 'Gas Natural', 'input');
    setValue('#amount', '900', 'input');
    submit();

    expect(root.querySelector('#amount-error')?.textContent).toContain('Saldo insuficiente');
    expect(emitted).toHaveLength(0);
  });
});
