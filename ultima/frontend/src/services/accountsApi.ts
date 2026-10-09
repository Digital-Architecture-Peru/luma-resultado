import type { Account } from "../types/account";

const BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8080";
// Identidad simulada: en produccion la aporta el token de sesion.
const CUSTOMER_ID: string = (import.meta.env.VITE_CUSTOMER_ID as string | undefined) ?? "C001";

export interface AccountsApi {
  list(signal?: AbortSignal): Promise<Account[]>;
  get(id: string, signal?: AbortSignal): Promise<Account>;
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}/api/v1/accounts${path}`, {
    headers: { Accept: "application/json", "X-Customer-Id": CUSTOMER_ID },
    signal,
  });
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Cuenta no encontrada"
        : `No se pudo completar la consulta (${response.status})`,
    );
  }
  return (await response.json()) as T;
}

export const accountsApi: AccountsApi = {
  list: (signal) => request<Account[]>("", signal),
  get: (id, signal) => request<Account>(`/${encodeURIComponent(id)}`, signal),
};
