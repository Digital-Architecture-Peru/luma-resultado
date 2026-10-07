import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Account, AccountsFilter } from '../../../core/accounts/account.model';
import { ACCOUNTS_QUERY, AccountsQueryPort } from '../../../core/accounts/accounts-query.port';
import { AccountsListPage } from './accounts-list.page';

const DATA: Account[] = [
  { id: '1', alias: 'Nómina', maskedNumber: '•••• 1111', type: 'corriente', currency: 'USD', availableBalance: 10, status: 'activa' },
  { id: '2', alias: 'Viaje', maskedNumber: '•••• 2222', type: 'ahorros', currency: 'USD', availableBalance: 20, status: 'activa' },
];

class FakePort implements AccountsQueryPort {
  lastFilter: AccountsFilter | undefined;
  fail = false;
  list(filter?: AccountsFilter): Observable<Account[]> {
    this.lastFilter = filter;
    if (this.fail) {
      return throwError(() => new Error('boom'));
    }
    return of(DATA.filter((a) => !filter?.type || a.type === filter.type));
  }
  getById(id: string): Observable<Account | undefined> {
    return of(DATA.find((a) => a.id === id));
  }
}

describe('AccountsListPage', () => {
  let fixture: ComponentFixture<AccountsListPage>;
  let port: FakePort;

  beforeEach(() => {
    port = new FakePort();
    TestBed.configureTestingModule({
      imports: [AccountsListPage],
      providers: [provideRouter([]), { provide: ACCOUNTS_QUERY, useValue: port }],
    });
    fixture = TestBed.createComponent(AccountsListPage);
  });

  it('given the port returns accounts when initialised then renders them all', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(2);
  });

  it('given a type chip clicked when filtering then queries the port with that type', () => {
    fixture.detectChanges();
    fixture.componentInstance.setType('ahorros');
    fixture.detectChanges();
    expect(port.lastFilter).toEqual({ type: 'ahorros' });
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
  });

  it('given an alias query when typing then filters the visible list', () => {
    fixture.detectChanges();
    fixture.componentInstance.query.set('viaj');
    fixture.detectChanges();
    expect(fixture.componentInstance.visible().map((a) => a.id)).toEqual(['2']);
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
  });

  it('given the port fails when loading then shows an error with retry', () => {
    port.fail = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    port.fail = false;
    fixture.componentInstance.load();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(2);
  });

  it('given an account selected when opened then navigates to its detail', () => {
    const router = TestBed.inject(Router);
    const spy = spyOn(router, 'navigate').and.resolveTo(true);
    fixture.componentInstance.open('2');
    expect(spy).toHaveBeenCalledWith(['/cuentas', '2']);
  });
});
