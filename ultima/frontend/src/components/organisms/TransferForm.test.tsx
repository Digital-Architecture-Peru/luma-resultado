import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Account } from "../../domain/types";
import { TransferForm } from "./TransferForm";

const accounts: Account[] = [
  { id: 1, number: "001", holder: "Demo", currency: "USD", balance: "100.00" },
  { id: 2, number: "002", holder: "Demo", currency: "USD", balance: "50.00" },
];

function fill(source: string, target: string, amount: string) {
  fireEvent.change(screen.getByLabelText("Cuenta origen"), { target: { value: source } });
  fireEvent.change(screen.getByLabelText("Cuenta destino"), { target: { value: target } });
  fireEvent.change(screen.getByLabelText("Monto"), { target: { value: amount } });
}

describe("TransferForm", () => {
  it("given empty form when submitting then shows errors and does not call onSubmit", () => {
    const onSubmit = vi.fn();
    render(<TransferForm accounts={accounts} submitting={false} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Transferir" }));

    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("given same source and target when submitting then shows distinct-account error", () => {
    const onSubmit = vi.fn();
    render(<TransferForm accounts={accounts} submitting={false} onSubmit={onSubmit} />);

    fill("1", "1", "5.00");
    fireEvent.click(screen.getByRole("button", { name: "Transferir" }));

    expect(screen.getByText("La cuenta destino debe ser distinta del origen.")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("given valid values when submitting then calls onSubmit with the request", async () => {
    const onSubmit = vi.fn();
    render(<TransferForm accounts={accounts} submitting={false} onSubmit={onSubmit} />);

    fill("1", "2", "10.50");
    fireEvent.change(screen.getByLabelText("Descripción"), { target: { value: " alquiler " } });
    fireEvent.click(screen.getByRole("button", { name: "Transferir" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: "10.50",
      description: "alquiler",
    });
  });

  it("given submitting state then the button is disabled", () => {
    render(<TransferForm accounts={accounts} submitting={true} onSubmit={vi.fn()} />);

    const button = screen.getByRole("button", { name: "Procesando…" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
