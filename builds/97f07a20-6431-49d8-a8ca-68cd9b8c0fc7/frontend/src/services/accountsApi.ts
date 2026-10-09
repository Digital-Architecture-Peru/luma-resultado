import type { Account, Movement, TransferReceipt, TransferRequest } from '../domain/types';

const BASE_URL = '/api/v1';

/** Error de la API con el detalle de application/problem+json. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const problem = (await response.json()) as { detail?: string };
    return new ApiError(response.status, problem.detail ?? 'No se pudo completar la operación.');
  } catch {
    return new ApiError(response.status, 'No se pudo completar la operación.');
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init);
  if (!response.ok) {
    throw await parseError(response);
  }
  return (await response.json()) as T;
}

export function listAccounts(): Promise<Account[]> {
  return request<Account[]>('/accounts');
}

export function listMovements(accountId: number): Promise<Movement[]> {
  return request<Movement[]>(`/accounts/${accountId}/movements`);
}

/** La clave de idempotencia evita un doble cargo si se reintenta la misma solicitud. */
export function createTransfer(body: TransferRequest, idempotencyKey: string): Promise<TransferReceipt> {
  return request<TransferReceipt>('/transfers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(body),
  });
}
