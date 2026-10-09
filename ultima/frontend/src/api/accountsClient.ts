import type { Account, AccountPage } from "../domain/account";

export interface AccountsApi {
  list(page?: number, size?: number): Promise<AccountPage>;
  get(id: string): Promise<Account>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ClientOptions {
  baseUrl: string;
  customerId: string;
  fetchImpl?: typeof fetch;
}

export function createAccountsClient(options: ClientOptions): AccountsApi {
  const doFetch = options.fetchImpl ?? ((...args: Parameters<typeof fetch>) => fetch(...args));

  async function request<T>(path: string): Promise<T> {
    const response = await doFetch(`${options.baseUrl}${path}`, {
      headers: { Accept: "application/json", "X-Customer-Id": options.customerId },
    });
    if (!response.ok) {
      throw new ApiError(response.status, await readDetail(response));
    }
    return (await response.json()) as T;
  }

  return {
    list: (page = 0, size = 20) => request<AccountPage>(`/api/v1/accounts?page=${page}&size=${size}`),
    get: (id) => request<Account>(`/api/v1/accounts/${encodeURIComponent(id)}`),
  };
}

async function readDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string };
    return body.detail ?? `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
}
