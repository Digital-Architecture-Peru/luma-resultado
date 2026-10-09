import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, MovementPage } from './models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);

  list(): Observable<Account[]> {
    return this.http.get<Account[]>('/api/v1/accounts');
  }

  movements(accountId: number, page = 0, size = 20): Observable<MovementPage> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<MovementPage>(`/api/v1/accounts/${accountId}/movements`, { params });
  }
}
