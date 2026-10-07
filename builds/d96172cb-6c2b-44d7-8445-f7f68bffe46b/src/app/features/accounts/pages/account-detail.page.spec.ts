import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Account } from '../../../core/accounts/account.model';
import { ACCOUNTS_QUERY, AccountsQueryPort } from '../../../core/accounts/accounts-query.port';
import { AccountDetailPage } from './account-detail.page';

const ACC: Account = {
  id: 'a1',
  alias: 'Ahorros personal',
  maskedNumber: '•••• 2222',
  type: 'ahorros',
  currency: 'USD',
  availableBalance: 50,
  status: 'activa',
};

const port: AccountsQueryPort = {
  list: () => of([ACC]),
  getById: (id) => of(id === ACC.id ? ACC : undefined),
};

function setup(id: string) {
  TestBed.configureTestingModule({
    imports: [AccountDetailPage],
    providers: [
      provideRouter([]),
      { provide: ACCOUNTS_QUERY, useValue: port },
      { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id })) } },
    ],
  });
  const fixture = TestBed.createComponent(AccountDetailPage);
  fixture.detectChanges();
  return fixture;
}

describe('AccountDetailPage', () => {
  it('given an existing id when loaded then shows alias and masked number', () => {
    const fixture = setup('a1');
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Ahorros personal');
    expect(text).toContain('•••• 2222');
  });

  it('given an unknown id when loaded then shows a not-found alert', () => {
    const fixture = setup('zzz');
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('No se encontró');
  });

  it('given back pressed when goBack then navigates to the list', () => {
    const fixture = setup('a1');
    const spy = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.componentInstance.goBack();
    expect(spy).toHaveBeenCalledWith(['/cuentas']);
  });
});
