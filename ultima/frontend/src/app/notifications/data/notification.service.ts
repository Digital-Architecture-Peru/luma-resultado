import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification, StatusFilter } from './models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/v1`;
  private readonly headers = new HttpHeaders({ 'X-Customer-Id': environment.customerId });

  list(filter: StatusFilter, page = 1, size = 20): Observable<AppNotification[]> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filter !== 'ALL') {
      params = params.set('status', filter);
    }
    return this.http.get<AppNotification[]>(`${this.base}/notifications`, { headers: this.headers, params });
  }

  unreadCount(): Observable<number> {
    return this.http
      .get<{ count: number }>(`${this.base}/notifications/unread-count`, { headers: this.headers })
      .pipe(map((r) => r.count));
  }

  markRead(id: string): Observable<AppNotification> {
    return this.http.patch<AppNotification>(
      `${this.base}/notifications/${encodeURIComponent(id)}/read`,
      null,
      { headers: this.headers },
    );
  }
}
