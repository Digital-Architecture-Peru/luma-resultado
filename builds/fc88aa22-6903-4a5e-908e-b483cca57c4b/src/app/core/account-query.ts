import { Account, AccountTypeFilter, CurrencyCode, CurrencyTotal } from './account.model';

const normalize = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

/** Filtra por texto (alias, número enmascarado) y por tipo de cuenta. */
export function filterAccounts(
  accounts: readonly Account[],
  query: string,
  type: AccountTypeFilter,
): Account[] {
  const needle = normalize(query);
  return accounts.filter((account) => {
    const matchesType = type === 'TODAS' || account.type === type;
    const haystack = normalize(`${account.alias} ${account.maskedNumber}`);
    return matchesType && haystack.includes(needle);
  });
}

/** Suma saldos por moneda; solo cuentas ACTIVAS, nunca mezcla monedas. */
export function totalsByCurrency(accounts: readonly Account[]): CurrencyTotal[] {
  const totals = new Map<CurrencyCode, { balance: number; available: number }>();
  for (const account of accounts) {
    if (account.status !== 'ACTIVA') {
      continue;
    }
    const current = totals.get(account.currency) ?? { balance: 0, available: 0 };
    totals.set(account.currency, {
      balance: current.balance + account.balance,
      available: current.available + account.available,
    });
  }
  return [...totals.entries()]
    .map(([currency, sum]) => ({
      currency,
      balance: Math.round(sum.balance * 100) / 100,
      available: Math.round(sum.available * 100) / 100,
    }))
    .sort((a, b) => a.currency.localeCompare(b.currency));
}
