import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CUSTOMER_HEADER, DEMO_CUSTOMER_REF, NotificationApiService } from './notification-api.service';

describe('NotificationApiService', () => {
  let service: NotificationApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('given a status filter, when listing, then sends paging, status and customer header', () => {
    service.list('CARD-1', 'UNREAD', 1, 10).subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/cards/CARD-1/notifications');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('UNREAD');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.headers.get(CUSTOMER_HEADER)).toBe(DEMO_CUSTOMER_REF);
    req.flush({ items: [], page: 1, size: 10, total: 0 });
  });

  it('given no status, when listing, then omits the status param', () => {
    service.list('CARD-1').subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/cards/CARD-1/notifications');
    expect(req.request.params.has('status')).toBe(false);
    req.flush({ items: [], page: 0, size: 20, total: 0 });
  });

  it('when marking as read, then sends PATCH to the read endpoint', () => {
    service.markAsRead('abc').subscribe();

    const req = http.expectOne('/api/v1/notifications/abc/read');
    expect(req.request.method).toBe('PATCH');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('when asking unread count, then returns the server value', () => {
    let result = -1;
    service.unreadCount().subscribe((r) => (result = r.count));

    http.expectOne('/api/v1/notifications/unread-count').flush({ count: 4 });
    expect(result).toBe(4);
  });
});
