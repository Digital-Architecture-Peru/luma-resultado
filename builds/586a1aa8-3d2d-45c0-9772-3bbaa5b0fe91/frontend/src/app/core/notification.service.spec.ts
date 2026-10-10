import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Page, PaymentNotification, Preference } from './models';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let http: HttpTestingController;

  const sample: PaymentNotification = {
    id: 'n1',
    paymentId: 'PAY-1',
    eventType: 'PAGO_EXITOSO',
    amount: 10,
    currency: 'USD',
    maskedAccount: '****1234',
    status: 'UNREAD',
    createdAt: '2026-01-15T10:00:00Z',
    readAt: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists notifications sending the customer header and paging params', () => {
    let result: Page<PaymentNotification> | undefined;
    service.list(1, 5).subscribe((page) => (result = page));

    const req = http.expectOne((r) => r.url === '/api/v1/payment-notifications');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('5');
    expect(req.request.headers.get('X-Customer-Id')).toBe('CUST-0001');
    req.flush({ items: [sample], page: 1, size: 5, totalElements: 1 });

    expect(result?.items.length).toBe(1);
  });

  it('marks a notification as read with PATCH', () => {
    let result: PaymentNotification | undefined;
    service.markRead('n1').subscribe((n) => (result = n));

    const req = http.expectOne('/api/v1/payment-notifications/n1/read');
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...sample, status: 'READ' });

    expect(result?.status).toBe('READ');
  });

  it('updates preferences wrapping them in a preferences field', () => {
    const prefs: Preference[] = [{ eventType: 'PAGO_EXITOSO', channel: 'SMS', enabled: false }];
    service.updatePreferences(prefs).subscribe();

    const req = http.expectOne('/api/v1/notification-preferences');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ preferences: prefs });
    req.flush(prefs);
  });
});
