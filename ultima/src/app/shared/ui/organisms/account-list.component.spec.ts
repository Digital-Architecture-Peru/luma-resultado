import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Account } from '../../../core/accounts/account.model';
import { AccountListComponent } from './account-list.component';

const make = (id: string): Account => ({
  id,
  alias: `Cuenta ${id}`,
  maskedNumber: '•••• 0000',
  type: 'corriente',
  currency: 'USD',
  availableBalance: 1,
  status: 'activa',
});

describe('AccountListComponent', () => {
  let fixture: ComponentFixture<AccountListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListComponent);
  });

  it('given accounts when rendered then shows one item per account', () => {
    fixture.componentRef.setInput('accounts', [make('a'), make('b')]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(2);
  });

  it('given no accounts when rendered then shows the empty state', () => {
    fixture.componentRef.setInput('accounts', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No se encontraron cuentas');
    expect(fixture.nativeElement.querySelector('ul')).toBeNull();
  });

  it('given a card click when selected then re-emits the id', () => {
    fixture.componentRef.setInput('accounts', [make('z')]);
    fixture.detectChanges();
    const ids: string[] = [];
    fixture.componentInstance.selected.subscribe((id) => ids.push(id));
    fixture.nativeElement.querySelector('button').click();
    expect(ids).toEqual(['z']);
  });
});
