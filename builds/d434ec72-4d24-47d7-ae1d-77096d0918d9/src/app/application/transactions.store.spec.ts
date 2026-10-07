import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CardsGateway } from '../domain/cards.gateway';
import { InMemoryCardsGateway } from '../infrastructure/in-memory-cards.gateway';
import { GENERIC_ERROR, TransactionsStore } from './transactions.store';

class FailingGateway extends InMemoryCardsGateway {
  override async submit(): Promise<never> {
    throw new Error('network down');
  }
}

/** El proyecto no usa Zone.js: el testbed necesita detección de cambios sin zona. */
function configure(gateway: new () => CardsGateway): TransactionsStore {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), { provide: CardsGateway, useClass: gateway }],
  });
  return TestBed.inject(TransactionsStore);
}

describe('TransactionsStore', () => {
  let store: TransactionsStore;

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = configure(InMemoryCardsGateway);
  });

  it('given cards when loaded then selects the first active card', async () => {
    await store.load();
    expect(store.cards().length).toBe(3);
    expect(store.selectedCardId()).toBe('card-1');
    expect(store.history()).toEqual([]);
  });

  it('given a valid purchase when submitted then updates receipt, balance and history', async () => {
    await store.load();
    await store.submit({ cardId: 'card-1', type: 'PURCHASE', amount: 100.25, description: 'Cena' });

    expect(store.error()).toBeNull();
    expect(store.receipt()?.id).toBe('TX-000001');
    expect(store.selectedCard()?.availableCredit).toBe(7399.75);
    expect(store.history().length).toBe(1);
    expect(store.busy()).toBe(false);
  });

  it('given a payment when submitted then restores available credit', async () => {
    await store.load();
    await store.submit({ cardId: 'card-1', type: 'PAYMENT', amount: 500, description: 'Pago mensual' });
    expect(store.selectedCard()?.availableCredit).toBe(8000);
  });

  it('given a rejected operation then exposes the reasons and no receipt', async () => {
    await store.load();
    await store.submit({ cardId: 'card-3', type: 'PURCHASE', amount: 10, description: 'Compra' });

    expect(store.receipt()).toBeNull();
    expect(store.error()).toContain('bloqueada');
  });

  it('given an unexpected failure then shows a generic message', async () => {
    TestBed.resetTestingModule();
    store = configure(FailingGateway);
    await store.load();
    await store.submit({ cardId: 'card-1', type: 'PURCHASE', amount: 10, description: 'Compra' });

    expect(store.error()).toBe(GENERIC_ERROR);
    expect(store.busy()).toBe(false);
  });

  it('given another card selected then history and messages reset', async () => {
    await store.load();
    await store.submit({ cardId: 'card-1', type: 'PURCHASE', amount: 10, description: 'Compra' });
    await store.select('card-2');

    expect(store.selectedCardId()).toBe('card-2');
    expect(store.receipt()).toBeNull();
    expect(store.history()).toEqual([]);
  });
});
