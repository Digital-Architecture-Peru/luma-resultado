export const CURRENCIES = ['PEN', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const MAX_AMOUNT = 50000;

export interface PaymentFormValues {
  originAccount: string;
  beneficiary: string;
  amount: string;
  currency: Currency;
  concept: string;
}

export type PaymentFormErrors = Partial<Record<keyof PaymentFormValues, string>>;

export interface PaymentRequest {
  originAccount: string;
  beneficiary: string;
  amount: number;
  currency: Currency;
  concept: string;
}

export interface PaymentResponse {
  id: string;
  status: 'PENDIENTE' | 'CONFIRMADO' | 'RECHAZADO';
  beneficiary: string;
  amount: number;
  currency: Currency;
  concept: string;
  createdAt: string;
}
