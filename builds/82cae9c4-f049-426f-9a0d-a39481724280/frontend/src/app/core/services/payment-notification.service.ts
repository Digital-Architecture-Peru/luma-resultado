import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, CUSTOMER_ID } from '../api-config';
import { NotificationPage, NotificationStatus } from '../models/payment-notification.model';

@Injectable({ providedIn: 'root' })
export class PaymentNotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly customerId = inject(CUSTOMER_ID);

  list(status?: NotificationStatus, page = 0, size = 20): Observable<NotificationPage> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<NotificationPage>(`${this.baseUrl}/payment-notifications`, {
      params,
      headers: this.headers(),
    });
  }

  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/payment-notifications/${encodeURIComponent(id)}/read`,
      null,
      { headers: this.headers() },
    );
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'X-Customer-Id': this.customerId });
  }
}
