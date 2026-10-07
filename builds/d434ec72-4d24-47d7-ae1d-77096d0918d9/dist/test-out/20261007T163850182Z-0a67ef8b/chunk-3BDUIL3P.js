// src/app/domain/card.model.ts
var TRANSACTION_TYPE_LABELS = {
  PURCHASE: "Consumo",
  PAYMENT: "Pago de tarjeta"
};
var TransactionRejectedError = class extends Error {
  reasons;
  constructor(reasons) {
    super(reasons.join(" "));
    this.reasons = reasons;
    this.name = "TransactionRejectedError";
  }
};

export {
  TRANSACTION_TYPE_LABELS,
  TransactionRejectedError
};
//# sourceMappingURL=chunk-3BDUIL3P.js.map
