import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Transfer, TransferRequest } from './models';
import { TransferService } from './transfer.service';

describe('TransferService', () => {
  let service: TransferService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(TransferService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given a request, when create is called, then POSTs with the Idempotency-Key header', () => {
    const request: TransferRequest = {
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: 30,
      currency: 'USD',
      description: 'Renta',
    };
    const response: Transfer = {
      id: 9,
      status: 'COMPLETED',
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: 30,
      currency: 'USD',
      description: 'Renta',
      createdAt: '2026-01-01T00:00:00Z',
    };
    let result: Transfer | undefined;

    service.create(request, 'key-1').subscribe((t) => (result = t));

    const req = http.expectOne('/api/v1/transfers');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('key-1');
    expect(req.request.body).toEqual(request);
    req.flush(response);
    expect(result).toEqual(response);
  });
});
