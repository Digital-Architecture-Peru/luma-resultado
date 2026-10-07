import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Card, TransactionRequest } from '../domain/card.model';
import { TransactionForm } from './transaction-form';

const cards: Card[] = [
  {
    id: 'c1',
    alias: 'Visa',
    maskedNumber: '**** 1111',
    currency: 'PEN',
    creditLimit: 1000,
    availableCredit: 800,
    status: 'ACTIVE',
  },
];

describe('TransactionForm', () => {
  let fixture: ComponentFixture<TransactionForm>;
  let root: HTMLElement;
  let emitted: TransactionRequest[];

  async function fill(id: string, value: string): Promise<void> {
    const input = root.querySelector(`#${id}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function submit(): Promise<void> {
    (root.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TransactionForm],
      providers: [provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(TransactionForm);
    fixture.componentRef.setInput('cards', cards);
    fixture.componentRef.setInput('selectedCardId', 'c1');
    emitted = [];
    fixture.componentInstance.submitted.subscribe((request) => emitted.push(request));
    root = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('given valid data when submitted then emits the request and clears the fields', async () => {
    await fill('amount', '150,50');
    await fill('description', 'Supermercado');
    await submit();

    expect(emitted).toEqual([
      { cardId: 'c1', type: 'PURCHASE', amount: 150.5, description: 'Supermercado' },
    ]);
    expect((root.querySelector('#amount') as HTMLInputElement).value).toBe('');
    expect(root.querySelector('[role="alert"]')).toBeNull();
  });

  it('given an invalid amount when submitted then shows an alert and does not emit', async () => {
    await fill('amount', 'abc');
    await fill('description', 'Supermercado');
    await submit();

    expect(emitted).toEqual([]);
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('monto');
  });

  it('given an amount above available credit then rejects locally', async () => {
    await fill('amount', '900');
    await fill('description', 'Electrodoméstico');
    await submit();

    expect(emitted).toEqual([]);
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('crédito disponible');
  });

  it('given busy then the submit button is disabled', async () => {
    fixture.componentRef.setInput('busy', true);
    await fixture.whenStable();
    expect((root.querySelector('button') as HTMLButtonElement).disabled).toBe(true);
  });
});
