import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchCard, fetchCards } from "../api/cardsApi";
import type { CardDetail, CardSummary } from "../types/card";
import { useCardDetail, useCards } from "./useCards";

vi.mock("../api/cardsApi", () => ({
  fetchCards: vi.fn(),
  fetchCard: vi.fn(),
}));

const summary: CardSummary = {
  id: "c1",
  alias: "Visa",
  maskedNumber: "**** **** **** 4821",
  type: "CREDIT",
  status: "ACTIVE",
  availableBalance: 10,
  currency: "USD",
};

const detail: CardDetail = {
  id: "c1",
  alias: "Visa",
  maskedNumber: "**** **** **** 4821",
  type: "CREDIT",
  status: "ACTIVE",
  creditLimit: 100,
  availableBalance: 10,
  currency: "USD",
  expiryDate: "2028-09-30",
};

describe("useCards", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("given the API resolves, when mounted, then ends in success with the cards", async () => {
    vi.mocked(fetchCards).mockResolvedValue([summary]);

    const { result } = renderHook(() => useCards());

    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current).toEqual({ status: "success", data: [summary] }));
  });

  it("given the API rejects, when mounted, then ends in error with the message", async () => {
    vi.mocked(fetchCards).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useCards());

    await waitFor(() => expect(result.current).toEqual({ status: "error", message: "boom" }));
  });
});

describe("useCardDetail", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("given no selection, then stays idle and does not call the API", () => {
    const { result } = renderHook(() => useCardDetail(null));

    expect(result.current.status).toBe("idle");
    expect(fetchCard).not.toHaveBeenCalled();
  });

  it("given a selected id, then loads its detail", async () => {
    vi.mocked(fetchCard).mockResolvedValue(detail);

    const { result } = renderHook(() => useCardDetail("c1"));

    await waitFor(() => expect(result.current).toEqual({ status: "success", data: detail }));
    expect(fetchCard).toHaveBeenCalledWith("c1");
  });
});
