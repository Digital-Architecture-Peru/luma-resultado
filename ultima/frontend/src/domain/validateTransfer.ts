import { isValidAmountText, toCents } from "./money";
import type { Account, TransferErrors, TransferFormValues } from "./types";

export function hasErrors(errors: TransferErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateTransfer(values: TransferFormValues, accounts: Account[]): TransferErrors {
  const errors: TransferErrors = {};
  const source = accounts.find((a) => String(a.id) === values.sourceId);
  const target = accounts.find((a) => String(a.id) === values.targetId);

  if (!source) errors.source = "Selecciona la cuenta origen.";
  if (!target) errors.target = "Selecciona la cuenta destino.";
  if (source && target && source.id === target.id) {
    errors.target = "La cuenta destino debe ser distinta del origen.";
  }
  if (source && target && source.id !== target.id && source.currency !== target.currency) {
    errors.target = "Las cuentas deben tener la misma moneda.";
  }

  if (!isValidAmountText(values.amount)) {
    errors.amount = "Ingresa un monto válido con máximo 2 decimales.";
  } else if (toCents(values.amount) <= 0) {
    errors.amount = "El monto debe ser mayor que 0.";
  } else if (source && toCents(values.amount) > toCents(source.balance)) {
    errors.amount = "Saldo insuficiente en la cuenta origen.";
  }

  return errors;
}
