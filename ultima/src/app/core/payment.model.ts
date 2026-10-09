export interface Account {
  readonly id: string;
  readonly name: string;
  readonly balance: number;
}

/** Datos tal como los escribe el usuario (el monto llega como texto). */
export interface PaymentDraft {
  sourceAccountId: string;
  beneficiary: string;
  amount: string;
  concept: string;
}

export interface Payment {
  readonly id: string;
  readonly sourceAccountId: string;
  readonly beneficiary: string;
  readonly amount: number;
  readonly concept: string;
  readonly createdAt: string;
  readonly status: 'completed';
}

export type PaymentErrors = Partial<Record<keyof PaymentDraft, string>>;

export interface Feedback {
  readonly kind: 'success' | 'error';
  readonly message: string;
}
