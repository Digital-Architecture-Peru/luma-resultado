import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE, CUSTOMER_ID, Page, PaymentNotification, Preference } from './models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly headers = new HttpHeaders({ 'X-Customer-Id': CUSTOMER_ID });

  list(page = 0, size = 20): Observable<Page<PaymentNotification>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<PaymentNotification>>(`${API_BASE}/payment-notifications`, {
      headers: this.headers,
      params,
    });
  }

  markRead(id: string): Observable<PaymentNotification> {
    return this.http.patch<PaymentNotification>(
      `${API_BASE}/payment-notifications/${encodeURIComponent(id)}/read`,
      null,
      { headers: this.headers },
    );
  }

  getPreferences(): Observable<Preference[]> {
    return this.http.get<Preference[]>(`${API_BASE}/notification-preferences`, {
      headers: this.headers,
    });
  }

  updatePreferences(preferences: Preference[]): Observable<Preference[]> {
    return this.http.put<Preference[]>(
      `${API_BASE}/notification-preferences`,
      { preferences },
      { headers: this.headers },
    );
  }
}
