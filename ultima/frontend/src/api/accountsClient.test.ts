import { describe, expect, it, vi } from "vitest";
import { ApiError, createAccountsClient } from "./accountsClient";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("accountsClient", () => {
  it("given a page request, when list is called, then sends customer header and query", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ items: [], page: 1, size: 5, total: 0 }));
    const client = createAccountsClient({
      baseUrl: "http://api",
      customerId: "CUST-0001",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const page = await client.list(1, 5);

    expect(page.total).toBe(0);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://api/api/v1/accounts?page=1&size=5");
    expect((init.headers as Record<string, string>)["X-Customer-Id"]).toBe("CUST-0001");
  });

  it("given a 404 problem response, when get is called, then throws ApiError with detail", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ status: 404, detail: "Cuenta no encontrada" }, 404),
    );
    const client = createAccountsClient({
      baseUrl: "http://api",
      customerId: "CUST-0001",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const error = await client.get("x").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(404);
    expect((error as ApiError).message).toBe("Cuenta no encontrada");
  });
});
