import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(NotificationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists unread notifications sending status param and customer header', () => {
    service.list('UNREAD').subscribe();

    const req = http.expectOne((r) => r.url.endsWith('/api/v1/notifications'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('UNREAD');
    expect(req.request.headers.get('X-Customer-Id')).toBeTruthy();
    req.flush([]);
  });

  it('omits status param when filter is ALL', () => {
    service.list('ALL').subscribe();

    const req = http.expectOne((r) => r.url.endsWith('/api/v1/notifications'));
    expect(req.request.params.has('status')).toBe(false);
    req.flush([]);
  });

  it('maps unread-count response to a number', () => {
    let result = -1;
    service.unreadCount().subscribe((n) => (result = n));

    http.expectOne((r) => r.url.endsWith('/notifications/unread-count')).flush({ count: 3 });

    expect(result).toBe(3);
  });

  it('marks a notification as read with PATCH', () => {
    service.markRead('abc').subscribe();

    const req = http.expectOne((r) => r.url.endsWith('/notifications/abc/read'));
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });
});
