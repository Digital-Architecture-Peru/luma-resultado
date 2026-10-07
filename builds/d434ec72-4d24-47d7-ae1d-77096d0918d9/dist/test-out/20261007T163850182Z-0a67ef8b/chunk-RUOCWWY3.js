// src/app/domain/transaction.validation.ts
var MAX_AMOUNT_PER_TRANSACTION = 5e3;
var MIN_DESCRIPTION_LENGTH = 3;
var MAX_DESCRIPTION_LENGTH = 60;
var AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;
function parseAmount(raw) {
  const normalized = raw.trim().replace(",", ".");
  return AMOUNT_PATTERN.test(normalized) ? Number(normalized) : Number.NaN;
}
function validateTransaction(request, card) {
  const errors = [];
  if (!card) {
    return ["Selecciona una tarjeta v\xE1lida."];
  }
  if (card.status !== "ACTIVE") {
    errors.push("La tarjeta est\xE1 bloqueada y no admite operaciones.");
  }
  if (!Number.isFinite(request.amount) || request.amount <= 0) {
    errors.push("Ingresa un monto mayor a cero con m\xE1ximo dos decimales.");
  } else {
    errors.push(...validateAmountAgainstCard(request, card));
  }
  const description = request.description.trim();
  if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`La descripci\xF3n debe tener entre ${MIN_DESCRIPTION_LENGTH} y ${MAX_DESCRIPTION_LENGTH} caracteres.`);
  }
  return errors;
}
function validateAmountAgainstCard(request, card) {
  if (request.type === "PURCHASE") {
    if (request.amount > MAX_AMOUNT_PER_TRANSACTION) {
      return [`El monto m\xE1ximo por consumo es ${MAX_AMOUNT_PER_TRANSACTION}.`];
    }
    return request.amount > card.availableCredit ? ["El monto excede el cr\xE9dito disponible."] : [];
  }
  const owed = card.creditLimit - card.availableCredit;
  return request.amount > owed ? ["El pago excede la deuda actual de la tarjeta."] : [];
}

export {
  parseAmount,
  validateTransaction
};
//# sourceMappingURL=chunk-RUOCWWY3.js.map
