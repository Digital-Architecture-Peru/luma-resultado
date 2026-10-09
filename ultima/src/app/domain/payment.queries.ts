import { Payment, PaymentFilter } from './payment.model';

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/** Filtra por texto (beneficiario, concepto o id) y estado; no muta la entrada. */
export function filterPayments(payments: readonly Payment[], filter: PaymentFilter): Payment[] {
  const needle = normalize(filter.text);
  return payments.filter((p) => {
    const matchesStatus = filter.status === 'ALL' || p.status === filter.status;
    const haystack = normalize(`${p.id} ${p.beneficiary} ${p.concept}`);
    return matchesStatus && haystack.includes(needle);
  });
}

/** Ordena del más reciente al más antiguo. */
export function sortByDateDesc(payments: readonly Payment[]): Payment[] {
  return [...payments].sort((a, b) => b.date.localeCompare(a.date));
}

/** Suma solo pagos completados, agrupando por moneda. */
export function totalCompletedByCurrency(payments: readonly Payment[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const p of payments) {
    if (p.status === 'COMPLETED') {
      totals[p.currency] = (totals[p.currency] ?? 0) + p.amount;
    }
  }
  return totals;
}

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
