import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CardApiService } from './card-api.service';
import { CardSummary } from './card.model';

describe('CardApiService', () => {
  let service: CardApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CardApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists cards sending the customer header', () => {
    const expected: CardSummary[] = [
      { id: '1', alias: 'Visa', maskedPan: '**** **** **** 4242', type: 'CREDIT', brand: 'VISA', status: 'ACTIVE' },
    ];
    let received: CardSummary[] = [];

    service.list().subscribe((cards) => (received = cards));

    const req = http.expectOne(`${environment.apiBaseUrl}/cards`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('X-Customer-Id')).toBe(environment.devCustomerId);
    req.flush(expected);
    expect(received).toEqual(expected);
  });

  it('requests the detail of a card by id', () => {
    service.get('abc').subscribe();

    const req = http.expectOne(`${environment.apiBaseUrl}/cards/abc`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
