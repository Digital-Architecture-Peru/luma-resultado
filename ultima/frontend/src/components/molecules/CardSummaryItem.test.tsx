import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CardSummary } from "../../types/card";
import CardSummaryItem from "./CardSummaryItem";

const card: CardSummary = {
  id: "c1",
  alias: "Visa Platinum",
  maskedNumber: "**** **** **** 4821",
  type: "CREDIT",
  status: "ACTIVE",
  availableBalance: 9820.55,
  currency: "USD",
};

describe("CardSummaryItem", () => {
  it("given a card, when clicked, then notifies the selected id", () => {
    const onSelect = vi.fn();
    render(<CardSummaryItem card={card} selected={false} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /Visa Platinum/ }));

    expect(onSelect).toHaveBeenCalledWith("c1");
  });

  it("given selected=true, when rendered, then marks the button as pressed", () => {
    render(<CardSummaryItem card={card} selected={true} onSelect={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });
});
