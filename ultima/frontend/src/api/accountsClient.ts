import type { Account, Transaction, TransferRequest, TransferResult } from "../domain/types";

export interface AccountsApi {
  listAccounts(): Promise<Account[]>;
  listTransactions(accountId: number, limit?: number): Promise<Transaction[]>;
  createTransfer(request: TransferRequest, idempotencyKey: string): Promise<TransferResult>;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type FetchFn = typeof fetch;

async function parse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }
  let message = "No se pudo completar la operación.";
  try {
    const problem = (await response.json()) as { detail?: string; title?: string };
    message = problem.detail ?? problem.title ?? message;
  } catch {
    // cuerpo sin JSON: se conserva el mensaje genérico
  }
  throw new ApiError(response.status, message);
}

export function createAccountsClient(
  fetchFn: FetchFn = (input, init) => fetch(input, init),
  baseUrl = "/api",
): AccountsApi {
  return {
    async listAccounts() {
      return parse<Account[]>(await fetchFn(`${baseUrl}/accounts`));
    },
    async listTransactions(accountId, limit = 20) {
      return parse<Transaction[]>(
        await fetchFn(`${baseUrl}/accounts/${accountId}/transactions?limit=${limit}`),
      );
    },
    async createTransfer(request, idempotencyKey) {
      return parse<TransferResult>(
        await fetchFn(`${baseUrl}/transfers`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
          body: JSON.stringify(request),
        }),
      );
    },
  };
}
