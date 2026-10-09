import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CardNotification, NotificationStatus, Page, UnreadCount } from './notification.model';

/** Cabecera de ejemplo: la identidad real la provee la plataforma de Banca por Internet. */
export const CUSTOMER_HEADER = 'X-Customer-Ref';
export const DEMO_CUSTOMER_REF = 'CUST-0001';
const BASE_URL = '/api/v1';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly headers = new HttpHeaders({ [CUSTOMER_HEADER]: DEMO_CUSTOMER_REF });

  list(cardRef: string, status?: NotificationStatus, page = 0, size = 20): Observable<Page<CardNotification>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Page<CardNotification>>(
      `${BASE_URL}/cards/${encodeURIComponent(cardRef)}/notifications`,
      { headers: this.headers, params },
    );
  }

  unreadCount(): Observable<UnreadCount> {
    return this.http.get<UnreadCount>(`${BASE_URL}/notifications/unread-count`, { headers: this.headers });
  }

  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(
      `${BASE_URL}/notifications/${encodeURIComponent(id)}/read`,
      null,
      { headers: this.headers },
    );
  }
}
