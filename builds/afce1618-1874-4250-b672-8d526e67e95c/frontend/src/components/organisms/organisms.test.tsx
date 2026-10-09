import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Account } from "../../types/account";
import { Amount } from "../atoms/Amount";
import { AccountDetail } from "./AccountDetail";
import { AccountList } from "./AccountList";

const accounts: Account[] = [
  {
    id: "1",
    maskedNumber: "****1234",
    type: "SAVINGS",
    currency: "PEN",
    balance: "15230.50",
    status: "ACTIVE",
    openedAt: "2021-03-15",
  },
  {
    id: "2",
    maskedNumber: "****5678",
    type: "CHECKING",
    currency: "PEN",
    balance: "480.00",
    status: "BLOCKED",
    openedAt: "2022-07-01",
  },
];

describe("AccountList", () => {
  it("given accounts, when rendered, then shows masked numbers and status", () => {
    render(<AccountList accounts={accounts} selectedId={null} onSelect={() => {}} />);

    expect(screen.getByText("****1234")).toBeInTheDocument();
    expect(screen.getByText("****5678")).toBeInTheDocument();
    expect(screen.getByText("Bloqueada")).toBeInTheDocument();
  });

  it("given an account, when clicked, then calls onSelect with its id", async () => {
    const onSelect = vi.fn();
    render(<AccountList accounts={accounts} selectedId={null} onSelect={onSelect} />);

    await userEvent.click(screen.getByRole("button", { name: /5678/ }));

    expect(onSelect).toHaveBeenCalledWith("2");
  });

  it("given no accounts, when rendered, then shows the empty message", () => {
    render(<AccountList accounts={[]} selectedId={null} onSelect={() => {}} />);

    expect(screen.getByText("No tienes cuentas registradas")).toBeInTheDocument();
  });
});

describe("AccountDetail", () => {
  it("given idle state, when rendered, then invites to select an account", () => {
    render(<AccountDetail state={{ status: "idle" }} />);

    expect(screen.getByText(/Selecciona una cuenta/)).toBeInTheDocument();
  });

  it("given error state, when rendered, then announces the error", () => {
    render(<AccountDetail state={{ status: "error", message: "Fallo de red" }} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Fallo de red");
  });

  it("given success state, when rendered, then shows the account data", () => {
    render(<AccountDetail state={{ status: "success", data: accounts[0] as Account }} />);

    expect(screen.getByRole("heading", { name: "Cuenta ****1234" })).toBeInTheDocument();
    expect(screen.getByText("Activa")).toBeInTheDocument();
  });
});

describe("Amount", () => {
  it("given a negative value, when rendered, then applies the negative style", () => {
    const { container } = render(<Amount value="-10.00" currency="PEN" />);

    expect(container.querySelector(".amount--negative")).not.toBeNull();
  });
});
