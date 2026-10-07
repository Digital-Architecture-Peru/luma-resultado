export interface Account {
  id: string;
  alias: string;
  maskedNumber: string;
  balance: number;
}

export interface Beneficiary {
  id: string;
  name: string;
  maskedNumber: string;
}

export interface PaymentRequest {
  sourceAccountId: string;
  beneficiaryId: string;
  amount: number;
  concept: string;
}

export interface PaymentReceipt {
  reference: string;
  request: PaymentRequest;
  newBalance: number;
}

/** Valores sin parsear tal como los escribe el usuario. */
export interface PaymentFormValues {
  sourceAccountId: string;
  beneficiaryId: string;
  amount: string;
  concept: string;
}

export type PaymentField = keyof PaymentFormValues;
export type PaymentErrors = Partial<Record<PaymentField, string>>;

export const MAX_CONCEPT_LENGTH = 60;
export const MAX_AMOUNT_PER_TRANSACTION = 50000;

/** Convierte "1250.50" o "1250,50" en número; null si no es un importe válido. */
export function parseAmount(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Number(normalized);
}

export function validatePayment(values: PaymentFormValues, accounts: Account[]): PaymentErrors {
  const errors: PaymentErrors = {};
  const source = accounts.find((a) => a.id === values.sourceAccountId);

  if (!source) errors.sourceAccountId = 'Selecciona una cuenta de origen.';
  if (!values.beneficiaryId) errors.beneficiaryId = 'Selecciona un beneficiario.';

  const amount = parseAmount(values.amount);
  if (amount === null || amount <= 0) {
    errors.amount = 'Ingresa un importe mayor a 0 con hasta 2 decimales.';
  } else if (amount > MAX_AMOUNT_PER_TRANSACTION) {
    errors.amount = `El importe máximo por operación es ${MAX_AMOUNT_PER_TRANSACTION}.`;
  } else if (source && amount > source.balance) {
    errors.amount = 'Saldo insuficiente en la cuenta de origen.';
  }

  const concept = values.concept.trim();
  if (concept.length === 0) errors.concept = 'Indica el concepto del pago.';
  else if (concept.length > MAX_CONCEPT_LENGTH) {
    errors.concept = `El concepto admite hasta ${MAX_CONCEPT_LENGTH} caracteres.`;
  }

  return errors;
}

export function toPaymentRequest(values: PaymentFormValues): PaymentRequest {
  const amount = parseAmount(values.amount);
  if (amount === null) throw new Error('Importe inválido');
  return {
    sourceAccountId: values.sourceAccountId,
    beneficiaryId: values.beneficiaryId,
    amount,
    concept: values.concept.trim()
  };
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
}
