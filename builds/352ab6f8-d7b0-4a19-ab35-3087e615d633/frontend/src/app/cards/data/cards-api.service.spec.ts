import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CardsApiService } from './cards-api.service';
import { CardSummary } from './card.model';

describe('CardsApiService', () => {
  let service: CardsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CardsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('given a list call, when subscribed, then GETs /api/v1/cards', () => {
    const expected: CardSummary[] = [
      {
        id: 'a',
        maskedPan: '**** **** **** 1111',
        brand: 'VISA',
        cardType: 'CREDIT',
        status: 'ACTIVE',
        availableBalance: 10,
        currency: 'USD',
      },
    ];
    let received: CardSummary[] = [];

    service.list().subscribe((cards) => (received = cards));

    const req = http.expectOne('/api/v1/cards');
    expect(req.request.method).toBe('GET');
    req.flush(expected);
    expect(received).toEqual(expected);
  });

  it('given an id, when get is called, then GETs the detail URL', () => {
    service.get('abc').subscribe();

    const req = http.expectOne('/api/v1/cards/abc');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
