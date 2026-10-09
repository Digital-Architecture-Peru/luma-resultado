import type { Payment, PaymentRequest } from '../types';

export interface PaymentsApi {
  create(request: PaymentRequest, idempotencyKey: string): Promise<Payment>;
}

interface ProblemBody {
  detail?: string;
}

export const httpPaymentsApi: PaymentsApi = {
  async create(request, idempotencyKey) {
    const response = await fetch('/api/v1/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const problem = (await response.json().catch(() => ({}))) as ProblemBody;
      throw new Error(problem.detail ?? `Error ${response.status}`);
    }
    return (await response.json()) as Payment;
  },
};
