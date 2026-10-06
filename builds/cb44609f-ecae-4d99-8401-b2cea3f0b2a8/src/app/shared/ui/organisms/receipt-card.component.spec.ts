import { TestBed } from '@angular/core/testing';
import { TransferReceipt } from '../../../core/accounts/model';
import { ReceiptCardComponent } from './receipt-card.component';

describe('ReceiptCardComponent', () => {
  const receipt: TransferReceipt = {
    operationId: 'op',
    reference: 'TRX-000007',
    fromAlias: 'Sueldo',
    toAlias: 'Ahorros',
    amountCents: 2550,
    currency: 'PEN',
    concept: '',
    executedAt: '2026-01-15T10:00:00.000Z',
  };

  const setup = () => {
    const fixture = TestBed.createComponent(ReceiptCardComponent);
    fixture.componentRef.setInput('receipt', receipt);
    fixture.detectChanges();
    return { el: fixture.nativeElement as HTMLElement, cmp: fixture.componentInstance };
  };

  it('given a receipt then announces success in a status region with its reference', () => {
    const { el } = setup();
    const status = el.querySelector('[role="status"]') as HTMLElement;
    expect(status.textContent).toContain('Transferencia exitosa');
    expect(status.textContent).toContain('TRX-000007');
  });

  it('given empty concept then shows "Sin concepto" and amount', () => {
    const { el } = setup();
    expect(el.textContent).toContain('Sin concepto');
    expect(el.textContent).toMatch(/25\.50/);
  });

  it('given click on new transfer then emits newTransfer', () => {
    const { el, cmp } = setup();
    let count = 0;
    cmp.newTransfer.subscribe(() => count++);
    (el.querySelector('button') as HTMLButtonElement).click();
    expect(count).toBe(1);
  });
});
