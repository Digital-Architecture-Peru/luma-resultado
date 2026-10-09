import type { PageResult, Payment, PaymentFilters } from '../types';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export interface PaymentsApi {
  list(filters: PaymentFilters): Promise<PageResult<Payment>>;
  get(id: string): Promise<Payment>;
}

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export function createPaymentsApi(
  baseUrl: string,
  customerId: string,
  fetchFn: FetchFn = (input, init) => fetch(input, init),
): PaymentsApi {
  const root = baseUrl.replace(/\/+$/, '');

  async function request<T>(path: string): Promise<T> {
    const response = await fetchFn(`${root}${path}`, {
      headers: { Accept: 'application/json', 'X-Customer-Id': customerId },
    });
    if (!response.ok) {
      let code = 'HTTP_ERROR';
      let message = `Error ${response.status}`;
      try {
        const body = (await response.json()) as { code?: string; message?: string };
        code = body.code ?? code;
        message = body.message ?? message;
      } catch {
        // cuerpo no JSON: se conserva el mensaje genérico
      }
      throw new ApiError(response.status, code, message);
    }
    return (await response.json()) as T;
  }

  return {
    list(filters) {
      const params = new URLSearchParams();
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);
      if (filters.status) params.set('status', filters.status);
      if (filters.page !== undefined) params.set('page', String(filters.page));
      if (filters.size !== undefined) params.set('size', String(filters.size));
      const query = params.toString();
      return request<PageResult<Payment>>(`/api/v1/payments${query ? `?${query}` : ''}`);
    },
    get(id) {
      return request<Payment>(`/api/v1/payments/${encodeURIComponent(id)}`);
    },
  };
}
