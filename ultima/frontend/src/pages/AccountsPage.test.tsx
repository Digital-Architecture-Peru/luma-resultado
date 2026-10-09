import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AccountsApi } from "../api/accountsClient";
import type { Account } from "../domain/account";
import { formatMoney } from "../components/atoms/MoneyText";
import { AccountList } from "../components/organisms/AccountList";
import { AccountsPage } from "./AccountsPage";

const savings: Account = {
  id: "a1",
  maskedNumber: "****0101",
  type: "SAVINGS",
  currency: "PEN",
  balance: "12500.50",
  status: "ACTIVE",
  updatedAt: "2026-09-30T10:00:00Z",
};
const checking: Account = { ...savings, id: "a2", maskedNumber: "****0202", type: "CHECKING", currency: "USD" };

function fakeApi(items: Account[]): AccountsApi {
  return {
    list: vi.fn(async () => ({ items, page: 0, size: 20, total: items.length })),
    get: vi.fn(async () => items[0]),
  };
}

describe("formatMoney", () => {
  it("given a decimal string, when formatted, then groups thousands with two decimals", () => {
    expect(formatMoney("12500.5", "PEN")).toBe("PEN 12,500.50");
  });

  it("given an invalid amount, when formatted, then shows a dash", () => {
    expect(formatMoney("abc", "USD")).toBe("USD –");
  });
});

describe("AccountList", () => {
  it("given no accounts, when rendered, then shows empty state", () => {
    render(<AccountList accounts={[]} selectedId={null} onSelect={() => undefined} />);
    expect(screen.getByText("No hay cuentas para mostrar.")).toBeTruthy();
  });

  it("given an account, when clicked, then calls onSelect with its id", () => {
    const onSelect = vi.fn();
    render(<AccountList accounts={[savings]} selectedId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith("a1");
  });
});

describe("AccountsPage", () => {
  it("given loaded accounts, when one is selected, then detail is shown", async () => {
    render(<AccountsPage api={fakeApi([savings, checking])} />);
    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);

    expect(screen.getByLabelText("Detalle de cuenta")).toBeTruthy();
  });

  it("given a type filter, when changed, then only matching accounts remain", async () => {
    render(<AccountsPage api={fakeApi([savings, checking])} />);
    await screen.findAllByRole("button");

    fireEvent.change(screen.getByLabelText("Tipo de cuenta"), { target: { value: "CHECKING" } });

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("given an API failure, when loading, then shows an alert", async () => {
    const api: AccountsApi = {
      list: vi.fn(async () => {
        throw new Error("boom");
      }),
      get: vi.fn(),
    };
    render(<AccountsPage api={api} />);
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("boom"));
  });
});
