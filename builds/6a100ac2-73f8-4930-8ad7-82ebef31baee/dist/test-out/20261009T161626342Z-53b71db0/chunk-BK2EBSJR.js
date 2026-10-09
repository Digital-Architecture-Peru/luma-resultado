// src/app/domain/payment.queries.ts
function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function filterPayments(payments, filter) {
  const needle = normalize(filter.text);
  return payments.filter((p) => {
    const matchesStatus = filter.status === "ALL" || p.status === filter.status;
    const haystack = normalize(`${p.id} ${p.beneficiary} ${p.concept}`);
    return matchesStatus && haystack.includes(needle);
  });
}
function sortByDateDesc(payments) {
  return [...payments].sort((a, b) => b.date.localeCompare(a.date));
}
function totalCompletedByCurrency(payments) {
  const totals = {};
  for (const p of payments) {
    if (p.status === "COMPLETED") {
      totals[p.currency] = (totals[p.currency] ?? 0) + p.amount;
    }
  }
  return totals;
}
function formatAmount(amount, currency) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export {
  filterPayments,
  sortByDateDesc,
  totalCompletedByCurrency,
  formatAmount
};
//# sourceMappingURL=chunk-BK2EBSJR.js.map
