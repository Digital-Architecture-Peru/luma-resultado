import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PaymentRequest } from './models';
import { PaymentApiService, describeError } from './payment-api.service';

describe('PaymentApiService', () => {
  let service: PaymentApiService;
  let http: HttpTestingController;

  const request: PaymentRequest = {
    sourceAccountId: '00100000000001',
    beneficiaryAccount: '00200000000002',
    amount: 10,
    currency: 'PEN',
    concept: 'Prueba'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PaymentApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given a request, when create is called, then POSTs with idempotency and customer headers', () => {
    service.create(request, 'key-123').subscribe();

    const req = http.expectOne((r) => r.url.endsWith('/api/v1/payments'));
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('key-123');
    expect(req.request.headers.get('X-Customer-Id')).toBeTruthy();
    req.flush({});
  });

  it('given a 409 response, when described, then mentions an already registered payment', () => {
    const message = describeError(new HttpErrorResponse({ status: 409 }));

    expect(message).toContain('ya fue registrado');
  });

  it('given a 400 with field errors, when described, then joins the messages', () => {
    const message = describeError(
      new HttpErrorResponse({ status: 400, error: { errors: { amount: ['Monto inválido.'] } } })
    );

    expect(message).toBe('Monto inválido.');
  });

  it('given a 500 response, when described, then returns a generic message', () => {
    expect(describeError(new HttpErrorResponse({ status: 500 }))).toContain('No fue posible');
  });
});
