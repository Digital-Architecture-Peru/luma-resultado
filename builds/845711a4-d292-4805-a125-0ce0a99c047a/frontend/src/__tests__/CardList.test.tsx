import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CardList } from "../components/organisms/CardList";
import { sampleCards } from "./fixtures";

describe("CardList", () => {
  it("given no cards when rendered then shows the empty state", () => {
    render(<CardList cards={[]} onSelect={() => {}} />);

    expect(screen.getByText("No tienes tarjetas asociadas.")).toBeInTheDocument();
  });

  it("given cards when rendered then shows masked numbers and status", () => {
    render(<CardList cards={sampleCards} onSelect={() => {}} />);

    expect(screen.getByText("**** **** **** 4242")).toBeInTheDocument();
    expect(screen.getByText("Bloqueada")).toBeInTheDocument();
  });

  it("given a card when clicked then notifies its id", () => {
    const onSelect = vi.fn();
    render(<CardList cards={sampleCards} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("**** **** **** 4242"));

    expect(onSelect).toHaveBeenCalledWith(sampleCards[0].id);
  });
});
