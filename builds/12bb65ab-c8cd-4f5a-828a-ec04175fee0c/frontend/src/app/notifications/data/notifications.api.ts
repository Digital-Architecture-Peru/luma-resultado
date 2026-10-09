import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedNotifications, Preference } from './models';

/** Puerto que consume el store; permite sustituir la API por un doble en pruebas. */
export interface NotificationsGateway {
  list(unreadOnly: boolean, page: number): Promise<PagedNotifications>;
  markRead(id: string): Promise<void>;
  getPreferences(): Promise<Preference[]>;
  savePreferences(preferences: Preference[]): Promise<Preference[]>;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApi implements NotificationsGateway {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/v1`;

  list(unreadOnly: boolean, page: number): Promise<PagedNotifications> {
    const params = new HttpParams().set('unreadOnly', unreadOnly).set('page', page);
    return firstValueFrom(this.http.get<PagedNotifications>(`${this.base}/notifications`, { params }));
  }

  async markRead(id: string): Promise<void> {
    await firstValueFrom(this.http.patch<void>(`${this.base}/notifications/${encodeURIComponent(id)}/read`, null));
  }

  getPreferences(): Promise<Preference[]> {
    return firstValueFrom(this.http.get<Preference[]>(`${this.base}/notification-preferences`));
  }

  savePreferences(preferences: Preference[]): Promise<Preference[]> {
    return firstValueFrom(this.http.put<Preference[]>(`${this.base}/notification-preferences`, preferences));
  }
}
