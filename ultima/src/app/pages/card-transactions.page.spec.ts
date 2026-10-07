import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CardsGateway } from '../domain/cards.gateway';
import { InMemoryCardsGateway } from '../infrastructure/in-memory-cards.gateway';
import { CardTransactionsPage } from './card-transactions.page';

describe('CardTransactionsPage', () => {
  let fixture: ComponentFixture<CardTransactionsPage>;
  let root: HTMLElement;

  async function settle(): Promise<void> {
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function fill(id: string, value: string): Promise<void> {
    const input = root.querySelector(`#${id}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CardTransactionsPage],
      providers: [
        provideZonelessChangeDetection(),
        { provide: CardsGateway, useClass: InMemoryCardsGateway },
      ],
    });
    fixture = TestBed.createComponent(CardTransactionsPage);
    root = fixture.nativeElement as HTMLElement;
    await settle();
  });

  it('given the page loads then shows the first card and an empty history', () => {
    expect(root.querySelector('app-card-summary')?.textContent).toContain('Visa Platinum');
    expect(root.querySelector('.empty')).not.toBeNull();
  });

  it('given a valid transaction then announces approval in role=status and lists the movement', async () => {
    await fill('amount', '120');
    await fill('description', 'Supermercado');
    (root.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await settle();
    await settle();

    expect(root.querySelector('[role="status"]')?.textContent).toContain('Transacción aprobada');
    expect(root.querySelector('tbody tr')?.textContent).toContain('Supermercado');
  });
});
