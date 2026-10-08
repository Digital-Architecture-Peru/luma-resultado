import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from './card.model';

export const CARDS_API = '/api/v1/cards';

@Injectable({ providedIn: 'root' })
export class CardService {
  constructor(private readonly http: HttpClient) {}

  list(): Observable<Card[]> {
    return this.http.get<Card[]>(CARDS_API);
  }

  get(cardId: string): Observable<Card> {
    return this.http.get<Card>(`${CARDS_API}/${encodeURIComponent(cardId)}`);
  }
}
