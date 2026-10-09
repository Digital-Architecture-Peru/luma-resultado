import { describe, expect, it, vi } from "vitest";
import { ApiError, createAccountsClient } from "./accountsClient";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("accountsClient", () => {
  it("given accounts response when listing then returns parsed accounts", async () => {
    const fetchFn = vi.fn(async () =>
      jsonResponse([{ id: 1, number: "001", holder: "Demo", currency: "USD", balance: "10.00" }], 200),
    );
    const client = createAccountsClient(fetchFn as unknown as typeof fetch);

    const accounts = await client.listAccounts();

    expect(accounts).toHaveLength(1);
    expect(fetchFn).toHaveBeenCalledWith("/api/accounts");
  });

  it("when creating a transfer then sends Idempotency-Key header and JSON body", async () => {
    const fetchFn = vi.fn(async (_url: string, _init?: RequestInit) =>
      jsonResponse({ id: 9, sourceAccountId: 1, targetAccountId: 2, amount: "5.00", status: "COMPLETED", createdAt: "x" }, 201),
    );
    const client = createAccountsClient(fetchFn as unknown as typeof fetch);
    const request = { sourceAccountId: 1, targetAccountId: 2, amount: "5.00", description: "" };

    const result = await client.createTransfer(request, "key-123");

    expect(result.id).toBe(9);
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe("key-123");
    expect(JSON.parse(init.body as string)).toEqual(request);
  });

  it("given a problem+json error when creating then throws ApiError with detail", async () => {
    const fetchFn = vi.fn(async () =>
      jsonResponse({ title: "INSUFFICIENT_FUNDS", detail: "Saldo insuficiente en la cuenta origen." }, 422),
    );
    const client = createAccountsClient(fetchFn as unknown as typeof fetch);

    const failure = client.createTransfer(
      { sourceAccountId: 1, targetAccountId: 2, amount: "999.00", description: "" },
      "k",
    );

    await expect(failure).rejects.toBeInstanceOf(ApiError);
    await expect(failure).rejects.toMatchObject({ status: 422, message: "Saldo insuficiente en la cuenta origen." });
  });
});
