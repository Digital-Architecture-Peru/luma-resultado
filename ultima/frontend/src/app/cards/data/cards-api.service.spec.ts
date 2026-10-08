import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CardsApiService } from './cards-api.service';

describe('CardsApiService', () => {
  let service: CardsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CardsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('given the API, when getCards, then GETs /cards with the customer header', () => {
    let result: unknown[] = [];
    service.getCards().subscribe((cards) => (result = cards));

    const req = http.expectOne(`${environment.apiBaseUrl}/cards`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('X-Customer-Id')).toBe(environment.devCustomerId);
    req.flush([]);
    expect(result).toEqual([]);
  });

  it('given an id, when getCard, then GETs /cards/{id}', () => {
    service.getCard('abc').subscribe();
    const req = http.expectOne(`${environment.apiBaseUrl}/cards/abc`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
