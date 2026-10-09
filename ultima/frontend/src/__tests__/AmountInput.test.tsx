import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AmountInput } from "../components/molecules/AmountInput";

afterEach(() => {
  cleanup();
});

describe("AmountInput", () => {
  it("given invalid amount and touched then shows error", () => {
    render(<AmountInput value="abc" onChange={() => undefined} touched />);
    expect(screen.getByRole("alert").textContent).toContain("monto mayor a 0");
  });

  it("given valid amount then shows no error", () => {
    render(<AmountInput value="10.50" onChange={() => undefined} touched />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("given typing then calls onChange with the text", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} touched={false} />);
    fireEvent.change(screen.getByLabelText("Monto"), { target: { value: "25" } });
    expect(onChange).toHaveBeenCalledWith("25");
  });
});
