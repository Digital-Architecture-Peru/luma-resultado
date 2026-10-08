import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Card, Movement, Page } from './models';

/** Base del API. En desarrollo se resuelve con proxy.conf.json; en despliegue, con el reverse proxy. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api/v1',
});

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  list(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.base}/cards`);
  }

  get(cardId: string): Observable<Card> {
    return this.http.get<Card>(`${this.base}/cards/${encodeURIComponent(cardId)}`);
  }

  movements(cardId: string, page = 1, size = 10): Observable<Page<Movement>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Movement>>(`${this.base}/cards/${encodeURIComponent(cardId)}/movements`, { params });
  }
}
