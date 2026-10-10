import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AccountNotification,
  NotificationPreferences,
  PreferencesUpdate,
  StatusFilter,
} from '../models/notification.model';

/** Base de la API; en desarrollo `proxy.conf.json` la redirige al backend. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api/v1',
});

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  list(accountId: string, status: StatusFilter, page = 0, size = 20): Observable<AccountNotification[]> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page)
      .set('size', size);
    return this.http.get<AccountNotification[]>(
      `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/notifications`,
      { params },
    );
  }

  markRead(id: string): Observable<AccountNotification> {
    return this.http.patch<AccountNotification>(
      `${this.baseUrl}/notifications/${encodeURIComponent(id)}/read`,
      {},
    );
  }

  getPreferences(accountId: string): Observable<NotificationPreferences> {
    return this.http.get<NotificationPreferences>(this.preferencesUrl(accountId));
  }

  updatePreferences(accountId: string, update: PreferencesUpdate): Observable<NotificationPreferences> {
    return this.http.put<NotificationPreferences>(this.preferencesUrl(accountId), update);
  }

  private preferencesUrl(accountId: string): string {
    return `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}/notification-preferences`;
  }
}
