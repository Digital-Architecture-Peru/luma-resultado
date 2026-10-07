import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CardsStore } from './cards.store';
import { CardsGateway } from '../data/cards.gateway';
import { MockCardsGateway } from '../data/mock-cards.gateway';
import { Card } from '../domain/card.model';

class EmptyGateway extends CardsGateway {
  list(): Observable<Card[]> { return of([]); }
  getById(): Observable<Card | null> { return of(null); }
}

class FailingGateway extends CardsGateway {
  list(): Observable<Card[]> { return throwError(() => new Error('boom')); }
  getById(): Observable<Card | null> { return throwError(() => new Error('boom')); }
}

function setup(gateway: new () => CardsGateway): CardsStore {
  TestBed.configureTestingModule({
    providers: [CardsStore, { provide: CardsGateway, useClass: gateway }],
  });
  return TestBed.inject(CardsStore);
}

describe('CardsStore', () => {
  it('given cards available, when loadCards, then exposes them and stops loading', () => {
    const store = setup(MockCardsGateway);
    store.loadCards();
    expect(store.cards().length).toBeGreaterThan(0);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
    expect(store.isEmpty()).toBeFalse();
  });

  it('given no cards, when loadCards, then isEmpty is true', () => {
    const store = setup(EmptyGateway);
    store.loadCards();
    expect(store.isEmpty()).toBeTrue();
  });

  it('given a failing gateway, when loadCards, then sets an error message', () => {
    const store = setup(FailingGateway);
    store.loadCards();
    expect(store.error()).toContain('No se pudo');
    expect(store.cards()).toEqual([]);
    expect(store.loading()).toBeFalse();
  });

  it('given an existing id, when loadCard, then selects it', () => {
    const store = setup(MockCardsGateway);
    store.loadCard('c-001');
    expect(store.selected()?.id).toBe('c-001');
    expect(store.notFound()).toBeFalse();
  });

  it('given an unknown id, when loadCard, then flags notFound', () => {
    const store = setup(MockCardsGateway);
    store.loadCard('zzz');
    expect(store.selected()).toBeNull();
    expect(store.notFound()).toBeTrue();
  });

  it('given a failing gateway, when loadCard, then sets an error message', () => {
    const store = setup(FailingGateway);
    store.loadCard('c-001');
    expect(store.error()).toContain('No se pudo');
  });
});
