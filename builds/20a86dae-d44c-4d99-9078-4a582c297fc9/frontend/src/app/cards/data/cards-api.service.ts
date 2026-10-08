import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CardDetail, CardSummary } from './card.model';

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  private readonly headers = new HttpHeaders({ 'X-Customer-Id': environment.devCustomerId });

  constructor(private readonly http: HttpClient) {}

  getCards(): Observable<CardSummary[]> {
    return this.http.get<CardSummary[]>(`${environment.apiBaseUrl}/cards`, { headers: this.headers });
  }

  getCard(id: string): Observable<CardDetail> {
    return this.http.get<CardDetail>(`${environment.apiBaseUrl}/cards/${encodeURIComponent(id)}`, {
      headers: this.headers,
    });
  }
}
