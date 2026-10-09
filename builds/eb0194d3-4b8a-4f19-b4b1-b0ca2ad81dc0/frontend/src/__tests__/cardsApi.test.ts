import { describe, expect, it, vi } from "vitest";
import { ApiError, createCardsApi } from "../services/cardsApi";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("cardsApi", () => {
  it("given a customer id when listing then calls the encoded v1 endpoint", async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse([]));
    const api = createCardsApi("http://api.test/", fetchFn);

    await api.listCards("demo 001");

    expect(fetchFn).toHaveBeenCalledWith("http://api.test/api/v1/customers/demo%20001/cards");
  });

  it("given a 404 problem response when getting a card then throws ApiError with detail", async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ detail: "No existe" }, 404));
    const api = createCardsApi("http://api.test", fetchFn);

    await expect(api.getCard("x")).rejects.toMatchObject({ status: 404, message: "No existe" });
    await expect(api.getCard("x")).rejects.toBeInstanceOf(ApiError);
  });

  it("given a non JSON error body when listing then falls back to a generic message", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response("boom", { status: 500 }));
    const api = createCardsApi("http://api.test", fetchFn);

    await expect(api.listCards("demo-001")).rejects.toThrow("Error 500");
  });
});
