import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationPage, NotificationStatusFilter } from './models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly headers = new HttpHeaders({ 'X-Customer-Id': environment.devCustomerId });

  list(
    accountId: string,
    status: NotificationStatusFilter = 'all',
    page = 1,
    pageSize = 20
  ): Observable<NotificationPage> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page)
      .set('pageSize', pageSize);
    return this.http.get<NotificationPage>(
      `${environment.apiBaseUrl}/accounts/${encodeURIComponent(accountId)}/notifications`,
      { headers: this.headers, params }
    );
  }

  unreadCount(accountId: string): Observable<number> {
    return this.http
      .get<{ count: number }>(
        `${environment.apiBaseUrl}/accounts/${encodeURIComponent(accountId)}/notifications/unread-count`,
        { headers: this.headers }
      )
      .pipe(map((r) => r.count));
  }

  markRead(id: string): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiBaseUrl}/notifications/${encodeURIComponent(id)}/read`,
      null,
      { headers: this.headers }
    );
  }
}
