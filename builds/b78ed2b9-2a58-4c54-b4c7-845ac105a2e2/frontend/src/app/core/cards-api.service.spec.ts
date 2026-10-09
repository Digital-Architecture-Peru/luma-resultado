import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL, CardsApiService } from './cards-api.service';

describe('CardsApiService', () => {
  let service: CardsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test/v1' },
      ],
    });
    service = TestBed.inject(CardsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given a payment, when posting, then it sends the Idempotency-Key header and body', () => {
    const request = { amount: 25, currency: 'USD', sourceAccountAlias: 'Cuenta ahorro' };

    service.pay('card-1', request, 'key-123').subscribe();

    const req = http.expectOne('http://api.test/v1/cards/card-1/payments');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('key-123');
    expect(req.request.body).toEqual(request);
    req.flush({});
  });

  it('given a card, when listing transactions, then it requests the page', () => {
    service.listTransactions('card-1', 2).subscribe();

    const req = http.expectOne((r) => r.url === 'http://api.test/v1/cards/card-1/transactions');
    expect(req.request.params.get('page')).toBe('2');
    req.flush([]);
  });

  it('given the API, when listing cards, then it returns the payload', () => {
    let count = -1;

    service.listCards().subscribe((cards) => (count = cards.length));

    http.expectOne('http://api.test/v1/cards').flush([]);
    expect(count).toBe(0);
  });
});
