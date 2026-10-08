import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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

  it('given the service when listing then calls GET /api/v1/cards', () => {
    let received: unknown[] = [];
    service.list().subscribe((cards) => (received = cards));

    const req = http.expectOne('/api/v1/cards');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    expect(received).toEqual([]);
  });

  it('given a card id when getting movements then sends page and size params', () => {
    service.movements('abc', 2, 5).subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/cards/abc/movements');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('5');
    req.flush({ items: [], page: 2, size: 5, total: 0 });
  });
});
