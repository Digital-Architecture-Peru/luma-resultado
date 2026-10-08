import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CardDetail, CardSummary } from './card.model';

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/cards';

  list(): Observable<CardSummary[]> {
    return this.http.get<CardSummary[]>(this.baseUrl);
  }

  get(id: string): Observable<CardDetail> {
    return this.http.get<CardDetail>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }
}
