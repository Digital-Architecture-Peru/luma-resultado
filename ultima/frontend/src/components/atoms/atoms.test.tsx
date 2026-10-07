import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Amount from "./Amount";
import MaskedPan from "./MaskedPan";
import StatusBadge from "./StatusBadge";

describe("atoms", () => {
  it("given a masked number, when rendered, then shows it without exposing more digits", () => {
    render(<MaskedPan value="**** **** **** 4821" />);
    expect(screen.getByText("**** **** **** 4821")).toBeInTheDocument();
    expect(screen.getByLabelText("Tarjeta terminada en 4821")).toBeInTheDocument();
  });

  it("given each status, when rendered, then shows its Spanish label", () => {
    const { rerender } = render(<StatusBadge status="ACTIVE" />);
    expect(screen.getByText("Activa")).toBeInTheDocument();
    rerender(<StatusBadge status="BLOCKED" />);
    expect(screen.getByText("Bloqueada")).toBeInTheDocument();
    rerender(<StatusBadge status="EXPIRED" />);
    expect(screen.getByText("Vencida")).toBeInTheDocument();
  });

  it("given an amount, when rendered, then formats it with the currency", () => {
    render(<Amount value={1234.5} currency="USD" />);
    expect(screen.getByText(/1[.,\s\u00a0]?234[.,]50/)).toBeInTheDocument();
  });
});
