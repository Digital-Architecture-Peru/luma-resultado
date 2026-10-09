import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("given a checked toggle when rendered then exposes a labelled switch that is on", () => {
    render(<Toggle id="t1" label="Compras" checked onChange={() => {}} />);

    expect(screen.getByRole("switch", { name: "Compras" })).toBeChecked();
  });

  it("given a checked toggle when clicked then reports the new value", async () => {
    const onChange = vi.fn();
    render(<Toggle id="t2" label="Compras" checked onChange={onChange} />);

    await userEvent.setup().click(screen.getByRole("switch", { name: "Compras" }));

    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("given a disabled toggle when clicked then does not report changes", async () => {
    const onChange = vi.fn();
    render(<Toggle id="t3" label="Pagos" checked={false} disabled onChange={onChange} />);

    await userEvent.setup().click(screen.getByRole("switch", { name: "Pagos" }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
