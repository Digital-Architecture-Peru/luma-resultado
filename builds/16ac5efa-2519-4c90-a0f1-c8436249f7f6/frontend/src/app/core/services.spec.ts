import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from './api-config';
import { AccountsService } from './accounts.service';
import { TransfersService } from './transfers.service';
import { Account, TransferRequest } from './models';

describe('HTTP services', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: '/api/v1' },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given accounts endpoint when list then GET /accounts returns data', () => {
    const accounts: Account[] = [{ id: 1, numberMasked: '****1001', currency: 'USD', balance: '10.00' }];
    let received: Account[] = [];

    TestBed.inject(AccountsService).list().subscribe((a) => (received = a));
    const req = http.expectOne('/api/v1/accounts');
    expect(req.request.method).toBe('GET');
    req.flush(accounts);

    expect(received).toEqual(accounts);
  });

  it('given account id when movements then GET with paging params', () => {
    TestBed.inject(AccountsService).movements(7, 1, 5).subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/accounts/7/movements');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('5');
    req.flush([]);
  });

  it('given a transfer when create then POST sends body and Idempotency-Key header', () => {
    const body: TransferRequest = {
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: '25.50',
      currency: 'USD',
      description: 'prueba',
    };

    TestBed.inject(TransfersService).create(body, 'key-123').subscribe();

    const req = http.expectOne('/api/v1/transfers');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('key-123');
    expect(req.request.body).toEqual(body);
    req.flush({ transferId: 't1', status: 'COMPLETED', createdAt: '2026-01-01T00:00:00Z' });
  });
});
