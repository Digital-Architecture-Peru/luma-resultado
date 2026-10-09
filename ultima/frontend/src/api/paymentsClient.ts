import type { PagedPayments, PaymentsQuery } from './types';

export interface PaymentsApi {
  list(query: PaymentsQuery): Promise<PagedPayments>;
}

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export function buildListUrl(baseUrl: string, q: PaymentsQuery): string {
  const params = new URLSearchParams();
  if (q.from) params.set('from', `${q.from}T00:00:00Z`);
  if (q.to) params.set('to', `${q.to}T23:59:59Z`);
  if (q.status) params.set('status', q.status);
  params.set('page', String(q.page));
  params.set('pageSize', String(q.pageSize));
  return `${baseUrl}/api/payments?${params.toString()}`;
}

/** H1: X-Customer-Id simula la identidad de la banca anfitriona; reemplazar por su token. */
export function createPaymentsClient(
  baseUrl: string,
  customerId: string,
  fetchFn: FetchFn = (input, init) => fetch(input, init),
): PaymentsApi {
  return {
    async list(query) {
      const response = await fetchFn(buildListUrl(baseUrl, query), {
        headers: { Accept: 'application/json', 'X-Customer-Id': customerId },
      });
      if (!response.ok) {
        throw new Error(`No se pudo consultar los pagos (HTTP ${response.status}).`);
      }
      return (await response.json()) as PagedPayments;
    },
  };
}
