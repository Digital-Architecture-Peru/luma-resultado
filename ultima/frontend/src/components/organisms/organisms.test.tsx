import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CardDetail, CardSummary } from "../../types/card";
import CardDetailPanel from "./CardDetailPanel";
import CardList from "./CardList";

const cards: CardSummary[] = [
  { id: "c1", alias: "Visa", maskedNumber: "**** **** **** 4821", type: "CREDIT", status: "ACTIVE", availableBalance: 10, currency: "USD" },
  { id: "c2", alias: "Debito", maskedNumber: "**** **** **** 1034", type: "DEBIT", status: "BLOCKED", availableBalance: 20, currency: "USD" },
];

const detail: CardDetail = {
  id: "c1",
  alias: "Visa",
  maskedNumber: "**** **** **** 4821",
  type: "CREDIT",
  status: "ACTIVE",
  creditLimit: 1000,
  availableBalance: 500,
  currency: "USD",
  expiryDate: "2028-09-30",
};

describe("CardList", () => {
  it("given cards, when rendered, then lists one item per card", () => {
    render(<CardList cards={cards} selectedId="c2" onSelect={() => {}} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Debito/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("given no cards, when rendered, then shows the empty state", () => {
    render(<CardList cards={[]} selectedId={null} onSelect={() => {}} />);
    expect(screen.getByText("No tienes tarjetas registradas.")).toBeInTheDocument();
  });
});

describe("CardDetailPanel", () => {
  it("given idle state, then asks to select a card", () => {
    render(<CardDetailPanel state={{ status: "idle" }} />);
    expect(screen.getByText(/Selecciona una tarjeta/)).toBeInTheDocument();
  });

  it("given error state, then shows an alert", () => {
    render(<CardDetailPanel state={{ status: "error", message: "Falla" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Falla");
  });

  it("given success state, then shows the card detail", () => {
    render(<CardDetailPanel state={{ status: "success", data: detail }} />);
    expect(screen.getByRole("heading", { name: "Visa" })).toBeInTheDocument();
    expect(screen.getByText("2028-09-30")).toBeInTheDocument();
    expect(screen.getByText("Credito")).toBeInTheDocument();
  });
});
