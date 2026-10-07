import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CardsLayout from "./CardsLayout";

describe("CardsLayout", () => {
  it("given list and detail slots, when rendered, then shows title and both slots", () => {
    render(<CardsLayout list={<p>LISTA</p>} detail={<p>DETALLE</p>} />);
    expect(screen.getByRole("heading", { level: 1, name: "Mis tarjetas" })).toBeInTheDocument();
    expect(screen.getByText("LISTA")).toBeInTheDocument();
    expect(screen.getByText("DETALLE")).toBeInTheDocument();
  });
});
