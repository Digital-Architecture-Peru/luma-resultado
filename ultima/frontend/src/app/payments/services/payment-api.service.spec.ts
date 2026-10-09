import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PaymentRequest } from '../models/payment.models';
import { PaymentApiService } from './payment-api.service';

describe('PaymentApiService', () => {
  let service: PaymentApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PaymentApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given accounts request when called then GETs /api/v1/accounts', () => {
    service.accounts().subscribe((a) => expect(a).toHaveLength(1));

    const req = http.expectOne('/api/v1/accounts');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'a1', number: 'EC00-1000-0001', currency: 'USD', balance: 10 }]);
  });

  it('given a payment when created then POSTs body with Idempotency-Key header', () => {
    const body: PaymentRequest = {
      sourceAccountId: 'a1',
      targetAccount: 'EC00-9999-0001',
      amount: 10,
      currency: 'USD',
      reference: 'Renta',
    };

    service.create(body, 'key-123').subscribe();

    const req = http.expectOne('/api/v1/payments');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('key-123');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('given an id when get then GETs the payment resource', () => {
    service.get('p-1').subscribe();

    const req = http.expectOne('/api/v1/payments/p-1');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
