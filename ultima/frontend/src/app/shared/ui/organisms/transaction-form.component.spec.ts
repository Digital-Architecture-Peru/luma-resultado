import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitTransactionEvent } from '../../../features/card-transaction/models/card-transaction.models';
import { TransactionFormComponent } from './transaction-form.component';

describe('TransactionFormComponent', () => {
  let fixture: ComponentFixture<TransactionFormComponent>;
  let component: TransactionFormComponent;
  let emitted: SubmitTransactionEvent[];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TransactionFormComponent] });
    fixture = TestBed.createComponent(TransactionFormComponent);
    component = fixture.componentInstance;
    emitted = [];
    component.submitted.subscribe((e: SubmitTransactionEvent) => emitted.push(e));
    fixture.detectChanges();
  });

  it('given empty form, when submit, then nothing is emitted and errors are shown', () => {
    component.submit();

    expect(emitted).toHaveLength(0);
    expect(component.errorFor('amount')).toBe('Campo obligatorio');
  });

  it('given zero amount, when submit, then amount error says it must be greater than 0', () => {
    component.form.patchValue({ cardId: 'c1', amount: 0, sourceAccountId: 'acc-1' });
    component.submit();

    expect(emitted).toHaveLength(0);
    expect(component.errorFor('amount')).toBe('El monto debe ser mayor a 0');
  });

  it('given valid values, when submit, then emits card id and request', () => {
    component.form.patchValue({ cardId: 'c1', amount: 25.5, sourceAccountId: 'acc-1', description: 'pago' });
    component.submit();

    expect(emitted).toEqual([
      { cardId: 'c1', request: { amount: 25.5, currency: 'USD', sourceAccountId: 'acc-1', description: 'pago' } },
    ]);
  });
});
