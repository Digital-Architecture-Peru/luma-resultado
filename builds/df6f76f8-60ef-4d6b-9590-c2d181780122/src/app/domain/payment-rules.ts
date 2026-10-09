import { Account, Card, PaymentMode } from './models';

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

/** Monto a pagar según el modo elegido; 0 si aún no se puede determinar. */
export function resolveAmount(card: Card | null, mode: PaymentMode, custom: number | null): number {
  if (mode === 'custom') {
    return custom !== null && Number.isFinite(custom) ? roundMoney(custom) : 0;
  }
  if (card === null) {
    return 0;
  }
  return mode === 'minimum' ? card.minimumPayment : card.balance;
}

/** Devuelve la lista de mensajes de error; vacía si el pago es válido. */
export function validatePayment(card: Card | null, account: Account | null, amount: number): string[] {
  const errors: string[] = [];
  if (card === null) {
    errors.push('Selecciona una tarjeta.');
  } else if (card.status === 'blocked') {
    errors.push('La tarjeta está bloqueada y no admite pagos desde este canal.');
  }
  if (account === null) {
    errors.push('Selecciona la cuenta de origen.');
  }
  if (!(amount > 0)) {
    errors.push('Ingresa un monto mayor a cero.');
    return errors;
  }
  if (card !== null && amount > card.balance) {
    errors.push('El monto no puede superar la deuda de la tarjeta.');
  }
  if (account !== null && amount > account.available) {
    errors.push('Saldo insuficiente en la cuenta de origen.');
  }
  return errors;
}
