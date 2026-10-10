import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationApiService } from './notification-api.service';

describe('NotificationApiService', () => {
  let service: NotificationApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given a status filter, when listing, then sends status and paging params', () => {
    service.list('10001234', 'UNREAD', 1, 10).subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/accounts/10001234/notifications');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('UNREAD');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('10');
    req.flush([]);
  });

  it('given an id, when marking read, then issues PATCH to the read endpoint', () => {
    service.markRead('abc').subscribe();

    const req = http.expectOne('/api/v1/notifications/abc/read');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('given new preferences, when updating, then issues PUT with the body', () => {
    const update = { lowBalanceThreshold: 50, depositEnabled: true, withdrawalEnabled: false };
    service.updatePreferences('10001234', update).subscribe();

    const req = http.expectOne('/api/v1/accounts/10001234/notification-preferences');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);
    req.flush({});
  });
});
