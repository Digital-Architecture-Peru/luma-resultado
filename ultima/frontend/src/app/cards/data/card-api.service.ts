import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CardDetail, CardSummary } from './card.model';

/** Acceso a la API de consulta de tarjetas (solo lectura). */
@Injectable({ providedIn: 'root' })
export class CardApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<CardSummary[]> {
    return this.http.get<CardSummary[]>(`${environment.apiBaseUrl}/cards`, { headers: this.headers() });
  }

  get(cardId: string): Observable<CardDetail> {
    return this.http.get<CardDetail>(`${environment.apiBaseUrl}/cards/${encodeURIComponent(cardId)}`, {
      headers: this.headers(),
    });
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'X-Customer-Id': environment.devCustomerId });
  }
}
