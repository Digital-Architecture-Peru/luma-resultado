import { TestBed } from '@angular/core/testing';
import { Account, TransferDraft } from '../../../core/accounts/model';
import { TransferFormComponent } from './transfer-form.component';

describe('TransferFormComponent', () => {
  const accounts: Account[] = [
    { id: 'a', alias: 'Sueldo', maskedNumber: '****1', balanceCents: 10000, currency: 'PEN' },
    { id: 'b', alias: 'Ahorros', maskedNumber: '****2', balanceCents: 500, currency: 'PEN' },
  ];

  const setup = (draft: TransferDraft | null = null) => {
    const fixture = TestBed.createComponent(TransferFormComponent);
    fixture.componentRef.setInput('accounts', accounts);
    fixture.componentRef.setInput('draft', draft);
    const emitted: TransferDraft[] = [];
    fixture.componentInstance.submitted.subscribe((d) => emitted.push(d));
    fixture.detectChanges();
    return { fixture, emitted, el: fixture.nativeElement as HTMLElement, cmp: fixture.componentInstance };
  };

  it('given an empty form when submitting then shows errors and emits nothing', () => {
    const { fixture, emitted, el } = setup();
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(emitted.length).toBe(0);
    expect(el.textContent).toContain('Selecciona la cuenta de origen.');
    expect(el.textContent).toContain('Ingresa un monto.');
  });

  it('given a valid form when submitting then emits a draft in cents', () => {
    const { fixture, emitted, cmp } = setup();
    cmp.form.setValue({ fromId: 'a', toId: 'b', amount: 25.5, concept: '  Renta ' });
    cmp.submit();
    fixture.detectChanges();
    expect(emitted).toEqual([{ fromId: 'a', toId: 'b', amountCents: 2550, concept: 'Renta' }]);
  });

  it('given the same account then reports the error and does not emit', () => {
    const { fixture, emitted, cmp, el } = setup();
    cmp.form.setValue({ fromId: 'a', toId: 'a', amount: 1, concept: '' });
    cmp.submit();
    fixture.detectChanges();
    expect(emitted.length).toBe(0);
    expect(el.textContent).toContain('deben ser distintas');
  });

  it('given amount above balance then reports insufficient funds', () => {
    const { fixture, emitted, cmp, el } = setup();
    cmp.form.setValue({ fromId: 'b', toId: 'a', amount: 5.01, concept: '' });
    cmp.submit();
    fixture.detectChanges();
    expect(emitted.length).toBe(0);
    expect(el.textContent).toContain('Saldo insuficiente');
  });

  it('given a previous draft then prefills the form', () => {
    const { cmp } = setup({ fromId: 'a', toId: 'b', amountCents: 1234, concept: 'X' });
    expect(cmp.form.getRawValue()).toEqual({ fromId: 'a', toId: 'b', amount: 12.34, concept: 'X' });
  });
});
