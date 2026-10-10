import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

describe('NotificationService', () => {
  let service: NotificationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(NotificationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given filters when list then sends query params and customer header', () => {
    let total = -1;
    service.list('ACC-001', 'unread', 2, 10).subscribe((p) => (total = p.total));

    const req = http.expectOne((r) => r.url === `${environment.apiBaseUrl}/accounts/ACC-001/notifications`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('unread');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.headers.get('X-Customer-Id')).toBe(environment.devCustomerId);
    req.flush({ items: [], total: 7 });

    expect(total).toBe(7);
  });

  it('given unread-count response when unreadCount then emits the number', () => {
    let count = -1;
    service.unreadCount('ACC-001').subscribe((c) => (count = c));

    http.expectOne(`${environment.apiBaseUrl}/accounts/ACC-001/notifications/unread-count`).flush({ count: 3 });

    expect(count).toBe(3);
  });

  it('given an id when markRead then sends PATCH to the read endpoint', () => {
    service.markRead('abc').subscribe();

    const req = http.expectOne(`${environment.apiBaseUrl}/notifications/abc/read`);
    expect(req.request.method).toBe('PATCH');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
