import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Account } from '../core/account.model';
import { AccountRepository } from '../core/account.repository';
import { AccountsPageComponent } from './accounts-page.component';

const ACCOUNTS: Account[] = [
  { id: '1', alias: 'Sueldo', type: 'AHORROS', maskedNumber: '**** 1234', currency: 'PEN', balance: 100, available: 100, status: 'ACTIVA' },
  { id: '2', alias: 'Viajes', type: 'CORRIENTE', maskedNumber: '**** 5678', currency: 'USD', balance: 50, available: 50, status: 'ACTIVA' },
];

class StubRepository extends AccountRepository {
  constructor(private readonly source: () => Observable<Account[]>) {
    super();
  }
  override list(): Observable<Account[]> {
    return this.source();
  }
}

function setup(source: () => Observable<Account[]>) {
  TestBed.configureTestingModule({
    providers: [{ provide: AccountRepository, useValue: new StubRepository(source) }],
  });
  const fixture = TestBed.createComponent(AccountsPageComponent);
  fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  return { fixture, root };
}

describe('AccountsPageComponent', () => {
  it('given accounts when loaded then renders one card per account and the count', () => {
    const { root } = setup(() => of(ACCOUNTS));

    expect(root.querySelectorAll('app-account-card')).toHaveLength(2);
    expect(root.querySelector('[role="status"]')?.textContent).toContain('2 de 2 cuentas');
  });

  it('given a typed query when filtering then only matching cards remain', () => {
    const { fixture, root } = setup(() => of(ACCOUNTS));
    const input = root.querySelector('#acc-query') as HTMLInputElement;

    input.value = 'viajes';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(root.querySelectorAll('app-account-card')).toHaveLength(1);
    expect(root.textContent).toContain('1 de 2 cuentas');
  });

  it('given a query without matches when filtering then shows the empty message', () => {
    const { fixture, root } = setup(() => of(ACCOUNTS));
    const input = root.querySelector('#acc-query') as HTMLInputElement;

    input.value = 'nada';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(root.textContent).toContain('No se encontraron cuentas');
  });

  it('given a failing repository when loading then shows alert and retry recovers', () => {
    let fail = true;
    const { fixture, root } = setup(() => (fail ? throwError(() => new Error('boom')) : of(ACCOUNTS)));

    expect(root.querySelector('[role="alert"]')).not.toBeNull();

    fail = false;
    (root.querySelector('[role="alert"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(root.querySelector('[role="alert"]')).toBeNull();
    expect(root.querySelectorAll('app-account-card')).toHaveLength(2);
  });

  it('given accounts in two currencies when loaded then summary shows a total per currency', () => {
    const { root } = setup(() => of(ACCOUNTS));

    expect(root.querySelectorAll('.summary-item')).toHaveLength(2);
  });
});
