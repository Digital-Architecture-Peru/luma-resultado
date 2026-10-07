import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CardsFacade } from './cards.facade';
import { CardsRepository } from './ports/cards.repository';
import { Card } from './models/card.model';
import { Movement } from './models/movement.model';

const CARD: Card = {
  id: 'a', alias: 'A', maskedNumber: '**** 0001', holder: 'H', type: 'DEBIT',
  brand: 'Visa', status: 'ACTIVE', expiry: '01/30', availableBalance: 1, currency: 'USD',
};

class FakeRepository extends CardsRepository {
  cards$: Observable<Card[]> = of([CARD]);
  override list(): Observable<Card[]> { return this.cards$; }
  override getById(id: string): Observable<Card | undefined> { return of(id === 'a' ? CARD : undefined); }
  override movements(): Observable<Movement[]> { return of([]); }
}

function setup(): { facade: CardsFacade; repo: FakeRepository } {
  const repo = new FakeRepository();
  TestBed.configureTestingModule({ providers: [{ provide: CardsRepository, useValue: repo }] });
  return { facade: TestBed.inject(CardsFacade), repo };
}

describe('CardsFacade', () => {
  it('given cards available when loadCards then status is data', () => {
    const { facade } = setup();
    facade.loadCards();
    expect(facade.listStatus()).toBe('data');
    expect(facade.cards()).toEqual([CARD]);
  });

  it('given no cards when loadCards then status is empty', () => {
    const { facade, repo } = setup();
    repo.cards$ = of([]);
    facade.loadCards();
    expect(facade.listStatus()).toBe('empty');
  });

  it('given repository failure when loadCards then status is error', () => {
    const { facade, repo } = setup();
    repo.cards$ = throwError(() => new Error('boom'));
    facade.loadCards();
    expect(facade.listStatus()).toBe('error');
  });

  it('given existing id when loadDetail then status is data', () => {
    const { facade } = setup();
    facade.loadDetail('a');
    expect(facade.detailStatus()).toBe('data');
    expect(facade.selectedCard()).toEqual(CARD);
  });

  it('given unknown id when loadDetail then status is empty', () => {
    const { facade } = setup();
    facade.loadDetail('zzz');
    expect(facade.detailStatus()).toBe('empty');
  });
});
