import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransferForm } from "../components/organisms/TransferForm";
import type { Account } from "../types";

const accounts: Account[] = [
  { id: 1, number: "000-100001", currency: "USD", balance: "5000.00" },
  { id: 2, number: "000-100002", currency: "USD", balance: "1250.50" },
];

afterEach(() => {
  cleanup();
});

function fillValid() {
  fireEvent.change(screen.getByLabelText("Cuenta origen"), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("Cuenta destino"), { target: { value: "2" } });
  fireEvent.change(screen.getByLabelText("Monto"), { target: { value: "100.00" } });
}

describe("TransferForm", () => {
  it("given submitting then the submit button is disabled", () => {
    render(<TransferForm accounts={accounts} submitting onSubmit={() => undefined} />);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("given valid data when submit then calls onSubmit with the input", () => {
    const onSubmit = vi.fn();
    render(<TransferForm accounts={accounts} submitting={false} onSubmit={onSubmit} />);
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: "Transferir" }));
    expect(onSubmit).toHaveBeenCalledWith({
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: "100.00",
      currency: "USD",
      description: "",
    });
  });

  it("given invalid amount when submit then does not call onSubmit", () => {
    const onSubmit = vi.fn();
    render(<TransferForm accounts={accounts} submitting={false} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Cuenta origen"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Cuenta destino"), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText("Monto"), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: "Transferir" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  });

  it("given same source and target then shows error and blocks submit", () => {
    const onSubmit = vi.fn();
    render(<TransferForm accounts={accounts} submitting={false} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Cuenta origen"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Cuenta destino"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Monto"), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: "Transferir" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toContain("distinta");
  });
});
