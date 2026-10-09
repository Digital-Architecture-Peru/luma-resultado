import { Account } from './account.model';
import { filterAccounts, totalsByCurrency } from './account-query';

const make = (overrides: Partial<Account>): Account => ({
  id: 'x',
  alias: 'Cuenta',
  type: 'AHORROS',
  maskedNumber: '**** 0000',
  currency: 'PEN',
  balance: 0,
  available: 0,
  status: 'ACTIVA',
  ...overrides,
});

describe('filterAccounts', () => {
  const accounts = [
    make({ id: '1', alias: 'Sueldo', maskedNumber: '**** 1234' }),
    make({ id: '2', alias: 'Depósito', type: 'PLAZO_FIJO', maskedNumber: '**** 5678' }),
  ];

  it('given empty query and TODAS when filtering then returns everything', () => {
    expect(filterAccounts(accounts, '', 'TODAS')).toHaveLength(2);
  });

  it('given a query without accents when filtering then matches accented alias', () => {
    expect(filterAccounts(accounts, 'deposito', 'TODAS').map((a) => a.id)).toEqual(['2']);
  });

  it('given last digits when filtering then matches masked number', () => {
    expect(filterAccounts(accounts, '1234', 'TODAS').map((a) => a.id)).toEqual(['1']);
  });

  it('given a type when filtering then only that type is returned', () => {
    expect(filterAccounts(accounts, '', 'PLAZO_FIJO').map((a) => a.id)).toEqual(['2']);
  });

  it('given no match when filtering then returns empty list', () => {
    expect(filterAccounts(accounts, 'zzz', 'TODAS')).toEqual([]);
  });
});

describe('totalsByCurrency', () => {
  it('given mixed currencies when summing then groups by currency without mixing', () => {
    const totals = totalsByCurrency([
      make({ currency: 'PEN', balance: 100.1, available: 50.05 }),
      make({ currency: 'PEN', balance: 0.2, available: 0.2 }),
      make({ currency: 'USD', balance: 10, available: 10 }),
    ]);
    expect(totals).toEqual([
      { currency: 'PEN', balance: 100.3, available: 50.25 },
      { currency: 'USD', balance: 10, available: 10 },
    ]);
  });

  it('given blocked or inactive accounts when summing then they are excluded', () => {
    const totals = totalsByCurrency([
      make({ status: 'BLOQUEADA', balance: 500 }),
      make({ status: 'INACTIVA', balance: 700 }),
    ]);
    expect(totals).toEqual([]);
  });
});
