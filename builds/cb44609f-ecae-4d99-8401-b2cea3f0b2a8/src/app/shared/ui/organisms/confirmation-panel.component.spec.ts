import { TestBed } from '@angular/core/testing';
import { Account } from '../../../core/accounts/model';
import { ConfirmationPanelComponent } from './confirmation-panel.component';

describe('ConfirmationPanelComponent', () => {
  const from: Account = { id: 'a', alias: 'Sueldo', maskedNumber: '****1', balanceCents: 1, currency: 'PEN' };
  const to: Account = { id: 'b', alias: 'Ahorros', maskedNumber: '****2', balanceCents: 1, currency: 'PEN' };

  const setup = (extra: Record<string, unknown> = {}) => {
    const fixture = TestBed.createComponent(ConfirmationPanelComponent);
    fixture.componentRef.setInput('from', from);
    fixture.componentRef.setInput('to', to);
    fixture.componentRef.setInput('amountCents', 5000);
    for (const [k, v] of Object.entries(extra)) {
      fixture.componentRef.setInput(k, v);
    }
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement, cmp: fixture.componentInstance };
  };

  const buttons = (el: HTMLElement) => Array.from(el.querySelectorAll('button')) as HTMLButtonElement[];

  it('given data then shows origin, destination and amount', () => {
    const { el } = setup();
    expect(el.textContent).toContain('Sueldo ****1');
    expect(el.textContent).toContain('Ahorros ****2');
    expect(el.textContent).toMatch(/50\.00/);
  });

  it('given click on confirm then emits confirmed', () => {
    const { el, cmp } = setup();
    let count = 0;
    cmp.confirmed.subscribe(() => count++);
    buttons(el)[1].click();
    expect(count).toBe(1);
  });

  it('given click on back then emits back', () => {
    const { el, cmp } = setup();
    let count = 0;
    cmp.back.subscribe(() => count++);
    buttons(el)[0].click();
    expect(count).toBe(1);
  });

  it('given submitting then both buttons are disabled', () => {
    const { el } = setup({ submitting: true });
    expect(buttons(el).every((b) => b.disabled)).toBeTrue();
  });

  it('given an error then shows an alert and offers retry', () => {
    const { el } = setup({ error: 'Servicio no disponible' });
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Servicio no disponible');
    expect(el.textContent).toContain('Reintentar');
  });
});
