export type Currency = 'PEN';

export interface Account {
  readonly id: string;
  readonly alias: string;
  readonly maskedNumber: string;
  /** Saldo en céntimos (entero) para evitar errores de coma flotante. */
  readonly balanceCents: number;
  readonly currency: Currency;
}

export interface TransferDraft {
  readonly fromId: string;
  readonly toId: string;
  readonly amountCents: number;
  readonly concept: string;
}

export interface TransferRequest extends TransferDraft {
  /** Identificador idempotente: reenviar el mismo id no duplica el movimiento. */
  readonly operationId: string;
}

export interface TransferReceipt {
  readonly operationId: string;
  readonly reference: string;
  readonly fromAlias: string;
  readonly toAlias: string;
  readonly amountCents: number;
  readonly currency: Currency;
  readonly concept: string;
  readonly executedAt: string;
}

export type GatewayErrorCode =
  | 'ACCOUNT_NOT_FOUND'
  | 'SAME_ACCOUNT'
  | 'INVALID_AMOUNT'
  | 'INSUFFICIENT_FUNDS'
  | 'UNAVAILABLE';

export class GatewayError extends Error {
  constructor(
    readonly code: GatewayErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'GatewayError';
  }
}

/** Convierte un monto decimal a céntimos. Devuelve null si no es finito o tiene más de 2 decimales. */
export function toCents(amount: number): number | null {
  if (!Number.isFinite(amount)) {
    return null;
  }
  const scaled = amount * 100;
  const cents = Math.round(scaled);
  return Math.abs(scaled - cents) < 1e-6 ? cents : null;
}
