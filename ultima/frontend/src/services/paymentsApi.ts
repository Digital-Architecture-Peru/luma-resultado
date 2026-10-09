import type { Account, PaymentRequest, PaymentResult } from '../types';

export interface PaymentsApi {
  listAccounts(): Promise<Account[]>;
  createPayment(request: PaymentRequest, idempotencyKey: string): Promise<PaymentResult>;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const problem = (await response.json()) as { detail?: string; title?: string };
    return new ApiError(problem.detail ?? problem.title ?? 'Error en el servicio de pagos', response.status);
  } catch {
    return new ApiError('Error en el servicio de pagos', response.status);
  }
}

export function createHttpPaymentsApi(baseUrl: string, fetchFn: typeof fetch = fetch): PaymentsApi {
  return {
    async listAccounts() {
      const response = await fetchFn(`${baseUrl}/api/accounts`);
      if (!response.ok) throw await toApiError(response);
      return (await response.json()) as Account[];
    },

    async createPayment(request, idempotencyKey) {
      const response = await fetchFn(`${baseUrl}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        // El monto ya fue validado (máx. 2 decimales); se convierte solo en el borde HTTP.
        body: JSON.stringify({ ...request, amount: Number(request.amount) }),
      });
      if (!response.ok) throw await toApiError(response);
      return (await response.json()) as PaymentResult;
    },
  };
}
