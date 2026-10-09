import { describe, expect, it, vi } from "vitest";
import { ApiError, createNotificationsClient } from "./notificationsClient";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("notificationsClient", () => {
  it("given list options when listing then builds the query and sends the customer header", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ items: [], page: 1, size: 5, total: 0 }));
    const client = createNotificationsClient("http://api.test/api/v1", "cust-1", fetchMock);

    await client.listNotifications("card-1", { unreadOnly: true, page: 1, size: 5 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://api.test/api/v1/cards/card-1/notifications?unread=true&page=1&size=5");
    expect((init?.headers as Record<string, string>)["X-Customer-Id"]).toBe("cust-1");
  });

  it("given a problem response when requesting then throws an ApiError with status and detail", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse({ title: "Acceso denegado", status: 403, detail: "No tienes acceso a esta tarjeta." }, 403),
    );
    const client = createNotificationsClient("http://api.test", "cust-1", fetchMock);

    const failure = await client.getPreferences("card-x").catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(ApiError);
    expect((failure as ApiError).status).toBe(403);
    expect((failure as ApiError).message).toBe("No tienes acceso a esta tarjeta.");
  });

  it("given preferences when updating then sends a PUT with a JSON body", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse([{ type: "PURCHASE", enabled: false }]));
    const client = createNotificationsClient("http://api.test", "cust-1", fetchMock);

    const result = await client.updatePreferences("card-1", [{ type: "PURCHASE", enabled: false }]);

    const [, init] = fetchMock.mock.calls[0];
    expect(init?.method).toBe("PUT");
    expect(init?.body).toBe(JSON.stringify([{ type: "PURCHASE", enabled: false }]));
    expect(result).toEqual([{ type: "PURCHASE", enabled: false }]);
  });

  it("given a notification id when marking as read then sends PATCH to the read endpoint", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse({ id: "n-1", read: true }));
    const client = createNotificationsClient("http://api.test", "cust-1", fetchMock);

    await client.markAsRead("n-1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://api.test/notifications/n-1/read");
    expect(init?.method).toBe("PATCH");
  });
});
