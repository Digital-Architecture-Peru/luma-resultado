import { Observable, of } from 'rxjs';
import { CardsRepository } from '../ports/cards.repository';
import { Card } from '../models/card.model';
import { Movement } from '../models/movement.model';
import { MOCK_CARDS, MOCK_MOVEMENTS } from './mock-data';

export class MockCardsAdapter extends CardsRepository {
  override list(): Observable<Card[]> {
    return of([...MOCK_CARDS]);
  }

  override getById(id: string): Observable<Card | undefined> {
    return of(MOCK_CARDS.find((card) => card.id === id));
  }

  override movements(cardId: string): Observable<Movement[]> {
    return of(MOCK_MOVEMENTS.filter((movement) => movement.cardId === cardId));
  }
}
