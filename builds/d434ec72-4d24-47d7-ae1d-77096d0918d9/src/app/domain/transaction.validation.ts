import { Card, TransactionRequest } from './card.model';

export const MAX_AMOUNT_PER_TRANSACTION = 5000;
export const MIN_DESCRIPTION_LENGTH = 3;
export const MAX_DESCRIPTION_LENGTH = 60;

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Convierte texto ingresado ("1.250,50" no se admite) en número; NaN si es inválido. */
export function parseAmount(raw: string): number {
  const normalized = raw.trim().replace(',', '.');
  return AMOUNT_PATTERN.test(normalized) ? Number(normalized) : Number.NaN;
}

/** Reglas puras de negocio; devuelve la lista de motivos de rechazo (vacía = válida). */
export function validateTransaction(
  request: TransactionRequest,
  card: Card | undefined,
): string[] {
  const errors: string[] = [];
  if (!card) {
    return ['Selecciona una tarjeta válida.'];
  }
  if (card.status !== 'ACTIVE') {
    errors.push('La tarjeta está bloqueada y no admite operaciones.');
  }
  if (!Number.isFinite(request.amount) || request.amount <= 0) {
    errors.push('Ingresa un monto mayor a cero con máximo dos decimales.');
  } else {
    errors.push(...validateAmountAgainstCard(request, card));
  }
  const description = request.description.trim();
  if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(
      `La descripción debe tener entre ${MIN_DESCRIPTION_LENGTH} y ${MAX_DESCRIPTION_LENGTH} caracteres.`,
    );
  }
  return errors;
}

function validateAmountAgainstCard(request: TransactionRequest, card: Card): string[] {
  if (request.type === 'PURCHASE') {
    if (request.amount > MAX_AMOUNT_PER_TRANSACTION) {
      return [`El monto máximo por consumo es ${MAX_AMOUNT_PER_TRANSACTION}.`];
    }
    return request.amount > card.availableCredit ? ['El monto excede el crédito disponible.'] : [];
  }
  const owed = card.creditLimit - card.availableCredit;
  return request.amount > owed ? ['El pago excede la deuda actual de la tarjeta.'] : [];
}
