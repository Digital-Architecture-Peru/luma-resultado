import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatusBadge } from "../components/atoms/StatusBadge";
import { CardItem } from "../components/molecules/CardItem";
import { CardList } from "../components/organisms/CardList";
import type { CardSummary } from "../types/card";

const card: CardSummary = {
  id: "c1",
  productName: "Visa Platinum",
  brand: "VISA",
  maskedPan: "**** **** **** 4821",
  status: "ACTIVE",
  currency: "USD",
  availableBalance: 11250.75,
};

describe("atoms and molecules", () => {
  it("given a blocked status when rendering the badge then shows its label", () => {
    render(<StatusBadge status="BLOCKED" />);
    expect(screen.getByText("Bloqueada")).toBeInTheDocument();
  });

  it("given a card when rendering the item then shows masked pan and formatted balance", () => {
    render(<CardItem card={card} onSelect={() => undefined} />);
    expect(screen.getByText("**** **** **** 4821")).toBeInTheDocument();
    expect(screen.getByText(/11,250\.75/)).toBeInTheDocument();
  });

  it("given a card when clicking details then notifies the card id", () => {
    const onSelect = vi.fn();
    render(<CardItem card={card} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /Ver detalle de Visa Platinum/ }));
    expect(onSelect).toHaveBeenCalledWith("c1");
  });
});

describe("CardList", () => {
  it("given loading state then announces it with role status", () => {
    render(<CardList state={{ kind: "loading" }} onSelect={() => undefined} />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando");
  });

  it("given error state then shows an alert", () => {
    render(<CardList state={{ kind: "error", message: "Falla" }} onSelect={() => undefined} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Falla");
  });

  it("given empty success then shows the empty message", () => {
    render(<CardList state={{ kind: "success", cards: [] }} onSelect={() => undefined} />);
    expect(screen.getByRole("status")).toHaveTextContent("no tiene tarjetas");
  });
});
