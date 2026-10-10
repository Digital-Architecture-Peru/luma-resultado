import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountNotification, ListOptions, NotificationPreference, PageResult } from './models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly base = `${environment.apiBaseUrl}/api/v1`;

  constructor(private readonly http: HttpClient) {}

  list(accountId: string, options: ListOptions): Observable<PageResult<AccountNotification>> {
    const params = new HttpParams()
      .set('unread', String(options.unreadOnly))
      .set('page', String(options.page))
      .set('size', String(options.size));
    return this.http.get<PageResult<AccountNotification>>(
      `${this.base}/accounts/${encodeURIComponent(accountId)}/notifications`,
      { params },
    );
  }

  markRead(id: string): Observable<AccountNotification> {
    return this.http.patch<AccountNotification>(
      `${this.base}/notifications/${encodeURIComponent(id)}/read`,
      {},
    );
  }

  getPreferences(accountId: string): Observable<NotificationPreference[]> {
    return this.http.get<NotificationPreference[]>(this.preferencesUrl(accountId));
  }

  savePreferences(
    accountId: string,
    preferences: NotificationPreference[],
  ): Observable<NotificationPreference[]> {
    return this.http.put<NotificationPreference[]>(this.preferencesUrl(accountId), preferences);
  }

  private preferencesUrl(accountId: string): string {
    return `${this.base}/accounts/${encodeURIComponent(accountId)}/notification-preferences`;
  }
}
