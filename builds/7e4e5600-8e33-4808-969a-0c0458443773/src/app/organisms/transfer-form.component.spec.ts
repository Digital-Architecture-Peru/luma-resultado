import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Account, TransferRequest } from '../core/models/account.model';
import { TransferFormComponent } from './transfer-form.component';

const accounts: Account[] = [
  { id: 'a', alias: 'Ahorros', number: '1', currency: 'PEN', balance: 500 },
  { id: 'b', alias: 'Corriente', number: '2', currency: 'PEN', balance: 100 },
];

describe('TransferFormComponent', () => {
  let fixture: ComponentFixture<TransferFormComponent>;
  let root: HTMLElement;
  let emitted: TransferRequest[];

  function setValue(selector: string, value: string, eventName: 'input' | 'change'): void {
    const el = root.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
    el.value = value;
    el.dispatchEvent(new Event(eventName));
  }

  function submit(): void {
    root.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TransferFormComponent] });
    fixture = TestBed.createComponent(TransferFormComponent);
    fixture.componentRef.setInput('accounts', accounts);
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    emitted = [];
    fixture.componentInstance.submitted.subscribe((r) => emitted.push(r));
  });

  it('given the form on load then shows the Transferir button', () => {
    expect(root.querySelector('button')?.textContent?.trim()).toBe('Transferir');
  });

  it('given an empty form when submitted then shows errors and emits nothing', () => {
    submit();
    expect(root.querySelectorAll('[role="alert"]').length).toBeGreaterThanOrEqual(3);
    expect(emitted).toHaveLength(0);
  });

  it('given valid values when submitted then emits the parsed request', () => {
    setValue('#source', 'a', 'change');
    setValue('#target', 'b', 'change');
    setValue('#amount', '150,25', 'input');
    setValue('#concept', ' Pago ', 'input');
    submit();

    expect(emitted).toEqual([{ sourceId: 'a', targetId: 'b', amount: 150.25, concept: 'Pago' }]);
    expect(root.querySelectorAll('[role="alert"]')).toHaveLength(0);
  });

  it('given amount over balance when submitted then shows insufficient funds', () => {
    setValue('#source', 'b', 'change');
    setValue('#target', 'a', 'change');
    setValue('#amount', '101', 'input');
    submit();

    expect(root.querySelector('#amount-error')?.textContent).toContain('insuficiente');
    expect(emitted).toHaveLength(0);
  });

  it('given busy state then disables the submit button', () => {
    fixture.componentRef.setInput('busy', true);
    fixture.detectChanges();
    expect(root.querySelector('button')?.disabled).toBe(true);
  });
});
