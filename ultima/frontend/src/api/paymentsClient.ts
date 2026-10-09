import type { PaymentRequest, PaymentResponse } from '../types';

export interface PaymentsClient {
  create(request: PaymentRequest, idempotencyKey: string): Promise<PaymentResponse>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function readProblemDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string };
    return body.detail ?? 'No se pudo procesar el pago';
  } catch {
    return 'No se pudo procesar el pago';
  }
}

export function createPaymentsClient(baseUrl: string = import.meta.env.VITE_API_URL ?? ''): PaymentsClient {
  return {
    async create(request, idempotencyKey) {
      const response = await fetch(`${baseUrl}/api/v1/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new ApiError(await readProblemDetail(response), response.status);
      }
      return (await response.json()) as PaymentResponse;
    },
  };
}
