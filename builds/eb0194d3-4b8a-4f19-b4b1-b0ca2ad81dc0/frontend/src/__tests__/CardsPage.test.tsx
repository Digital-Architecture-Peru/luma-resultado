import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CardsPage } from "../pages/CardsPage";
import type { CardsApi } from "../services/cardsApi";
import type { CardDetail, CardSummary } from "../types/card";

const summary: CardSummary = {
  id: "c1",
  productName: "Visa Platinum",
  brand: "VISA",
  maskedPan: "**** **** **** 4821",
  status: "ACTIVE",
  currency: "USD",
  availableBalance: 100,
};

const detail: CardDetail = { ...summary, creditLimit: 15000, expiry: "12/28" };

function fakeApi(overrides: Partial<CardsApi> = {}): CardsApi {
  return {
    listCards: vi.fn().mockResolvedValue([summary]),
    getCard: vi.fn().mockResolvedValue(detail),
    ...overrides,
  };
}

describe("CardsPage", () => {
  it("given the page loads then lists the demo customer cards", async () => {
    const api = fakeApi();
    render(<CardsPage api={api} />);

    expect(await screen.findByText("Visa Platinum")).toBeInTheDocument();
    expect(api.listCards).toHaveBeenCalledWith("demo-001");
  });

  it("given a card when selecting details then shows limit and expiry", async () => {
    render(<CardsPage api={fakeApi()} />);

    fireEvent.click(await screen.findByRole("button", { name: /Ver detalle/ }));

    expect(await screen.findByText("12/28")).toBeInTheDocument();
    expect(screen.getByText("$15,000.00")).toBeInTheDocument();
  });

  it("given the api fails then shows an alert", async () => {
    const api = fakeApi({ listCards: vi.fn().mockRejectedValue(new Error("Servicio no disponible")) });
    render(<CardsPage api={api} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Servicio no disponible");
  });

  it("given a new customer id when searching then queries that customer", async () => {
    const api = fakeApi();
    render(<CardsPage api={api} />);
    await screen.findByText("Visa Platinum");

    fireEvent.change(screen.getByLabelText("Código de cliente"), { target: { value: "demo-002" } });
    fireEvent.click(screen.getByRole("button", { name: "Consultar tarjetas" }));

    expect(api.listCards).toHaveBeenLastCalledWith("demo-002");
  });
});
