import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CardTransactionService } from './card-transaction.service';

describe('CardTransactionService', () => {
  let service: CardTransactionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CardTransactionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given a card and key, when createTransaction, then POSTs with Idempotency-Key header', () => {
    const request = { amount: 10, currency: 'USD', sourceAccountId: 'acc-1', description: 'x' };
    let status = '';

    service.createTransaction('card-1', request, 'key-1').subscribe((r) => (status = r.status));

    const req = http.expectOne('/api/v1/cards/card-1/transactions');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('key-1');
    expect(req.request.body).toEqual(request);
    req.flush({ transactionId: 't1', status: 'APPROVED' });
    expect(status).toBe('APPROVED');
  });

  it('given a card, when history, then GETs with page and size params', () => {
    service.history('card-1', 2, 5).subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/cards/card-1/transactions');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('5');
    req.flush({ items: [], page: 2, size: 5, total: 0 });
  });
});
