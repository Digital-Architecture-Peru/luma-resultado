import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Account, Movement } from './models';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  list(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts`);
  }

  movements(accountId: number, page = 0, size = 20): Observable<Movement[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Movement[]>(`${this.baseUrl}/accounts/${accountId}/movements`, { params });
  }
}
