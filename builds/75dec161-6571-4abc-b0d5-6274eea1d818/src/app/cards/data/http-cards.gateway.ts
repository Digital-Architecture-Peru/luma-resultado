import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Card } from '../domain/card.model';
import { CardsGateway } from './cards.gateway';
import { environment } from '../../../environments/environment';

/**
 * Adaptador HTTP: stub no cableado por defecto (integración sin definir, H5).
 * Se activa con environment.useMock = false y apiBaseUrl definido.
 * La autenticación la aporta el shell (p. ej. interceptor); aquí no hay tokens.
 */
@Injectable()
export class HttpCardsGateway extends CardsGateway {
  private readonly http = inject(HttpClient);

  private base(): string {
    if (!environment.apiBaseUrl) {
      throw new Error('apiBaseUrl no configurado: integración sin definir');
    }
    return environment.apiBaseUrl.replace(/\/+$/, '');
  }

  list(): Observable<Card[]> {
    try {
      return this.http.get<Card[]>(`${this.base()}/cards`);
    } catch (e) {
      return throwError(() => e);
    }
  }

  getById(id: string): Observable<Card | null> {
    try {
      return this.http.get<Card | null>(`${this.base()}/cards/${encodeURIComponent(id)}`);
    } catch (e) {
      return throwError(() => e);
    }
  }
}
