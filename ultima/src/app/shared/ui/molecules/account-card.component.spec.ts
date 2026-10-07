import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Account } from '../../../core/accounts/account.model';
import { AccountCardComponent } from './account-card.component';

const ACCOUNT: Account = {
  id: 'x1',
  alias: 'Cuenta de prueba',
  maskedNumber: '•••• 4321',
  type: 'ahorros',
  currency: 'USD',
  availableBalance: 100,
  status: 'bloqueada',
};

describe('AccountCardComponent', () => {
  let fixture: ComponentFixture<AccountCardComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCardComponent);
    fixture.componentRef.setInput('account', ACCOUNT);
    fixture.detectChanges();
  });

  it('given an account when rendered then shows alias, masked number and status text', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Cuenta de prueba');
    expect(text).toContain('•••• 4321');
    expect(text).toContain('Bloqueada');
  });

  it('given a click when selected then emits the account id', () => {
    const ids: string[] = [];
    fixture.componentInstance.selected.subscribe((id) => ids.push(id));
    fixture.nativeElement.querySelector('button').click();
    expect(ids).toEqual(['x1']);
  });
});
