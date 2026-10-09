import type { Account, TransferInput, TransferReceipt, TransfersClient } from "../types";

const BASE_URL = "/api/v1";
// Stub de identidad: no apto para producción.
const CUSTOMER_ID: string = import.meta.env.VITE_CUSTOMER_ID ?? "1";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Customer-Id": CUSTOMER_ID,
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    let detail = `Error ${response.status}`;
    try {
      const problem = (await response.json()) as { detail?: string };
      if (problem.detail) detail = problem.detail;
    } catch {
      // cuerpo no JSON: se conserva el mensaje genérico
    }
    throw new ApiError(response.status, detail);
  }
  return (await response.json()) as T;
}

export const httpTransfersClient: TransfersClient = {
  listAccounts: () => request<Account[]>("/accounts"),
  createTransfer: (input: TransferInput, idempotencyKey: string) =>
    request<TransferReceipt>("/transfers", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(input),
    }),
};
