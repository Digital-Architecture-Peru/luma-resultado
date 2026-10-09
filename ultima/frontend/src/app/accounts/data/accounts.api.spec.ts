import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountsApi, DEV_CUSTOMER_ID } from './accounts.api';

describe('AccountsApi', () => {
  let api: AccountsApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DEV_CUSTOMER_ID, useValue: '33333333-3333-4333-8333-333333333333' }
      ]
    });
    api = TestBed.inject(AccountsApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('given page and size when listing then calls paginated endpoint with customer header', () => {
    api.listar(2, 5).subscribe();

    const req = http.expectOne((r) => r.url === '/api/v1/accounts');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('5');
    expect(req.request.headers.get('X-Customer-Id')).toBe('33333333-3333-4333-8333-333333333333');
    req.flush({ items: [], page: 2, size: 5, total: 0 });
  });

  it('given an id when fetching then calls detail endpoint', () => {
    api.obtener('abc').subscribe();

    const req = http.expectOne('/api/v1/accounts/abc');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
