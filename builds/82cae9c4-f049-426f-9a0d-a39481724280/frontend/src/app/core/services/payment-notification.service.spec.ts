import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificationPage } from '../models/payment-notification.model';
import { PaymentNotificationService } from './payment-notification.service';

describe('PaymentNotificationService', () => {
  let service: PaymentNotificationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PaymentNotificationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given UNREAD filter, when list, then sends status, paging and customer header', () => {
    const page: NotificationPage = { items: [], total: 0 };
    let received: NotificationPage | undefined;

    service.list('UNREAD', 1, 10).subscribe((p) => (received = p));

    const req = http.expectOne((r) => r.url === '/api/v1/payment-notifications');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('UNREAD');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.headers.get('X-Customer-Id')).toBe('CUST-0001');
    req.flush(page);
    expect(received).toEqual(page);
  });

  it('given no filter, when list, then omits status param', () => {
    service.list().subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/payment-notifications');
    expect(req.request.params.has('status')).toBe(false);
    req.flush({ items: [], total: 0 });
  });

  it('given an id, when markAsRead, then PATCHes the read endpoint', () => {
    service.markAsRead('abc').subscribe();

    const req = http.expectOne('/api/v1/payment-notifications/abc/read');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('X-Customer-Id')).toBe('CUST-0001');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
