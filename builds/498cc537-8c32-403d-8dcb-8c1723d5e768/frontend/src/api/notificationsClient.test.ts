import { describe, expect, it, vi } from "vitest";
import { ApiError, createNotificationsClient } from "./notificationsClient";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("notificationsClient", () => {
  it("given a customer, when listing, then sends X-Customer-Id and query params", async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse([]));
    const client = createNotificationsClient("http://api", "cust-1", fetchFn);

    await client.list("unread", 5);

    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://api/api/v1/notifications?status=unread&limit=5");
    expect((init.headers as Record<string, string>)["X-Customer-Id"]).toBe("cust-1");
  });

  it("given the count endpoint, when unreadCount, then returns the number", async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ count: 3 }));
    const client = createNotificationsClient("http://api", "cust-1", fetchFn);

    await expect(client.unreadCount()).resolves.toBe(3);
  });

  it("given an id, when markRead, then sends PATCH to the read endpoint", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const client = createNotificationsClient("http://api", "cust-1", fetchFn);

    await client.markRead("abc");

    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://api/api/v1/notifications/abc/read");
    expect(init.method).toBe("PATCH");
  });

  it("given a 404 response, when markRead, then rejects with ApiError", async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({}, 404));
    const client = createNotificationsClient("http://api", "cust-1", fetchFn);

    await expect(client.markRead("zzz")).rejects.toBeInstanceOf(ApiError);
  });
});
