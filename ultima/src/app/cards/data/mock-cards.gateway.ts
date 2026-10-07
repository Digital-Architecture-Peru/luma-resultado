import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from '../domain/card.model';
import { CardsGateway } from './cards.gateway';
import { MOCK_CARDS } from './mock-cards.data';

@Injectable()
export class MockCardsGateway extends CardsGateway {
  list(): Observable<Card[]> {
    return of(MOCK_CARDS.map((c) => ({ ...c })));
  }

  getById(id: string): Observable<Card | null> {
    return this.list().pipe(map((cards) => cards.find((c) => c.id === id) ?? null));
  }
}
