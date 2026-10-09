import { describe, expect, it } from "vitest";
import { toCents } from "../domain/money";
import type { Account, TransferFormValues } from "../domain/types";
import { hasErrors, validateTransfer } from "../domain/validateTransfer";

const accounts: Account[] = [
  { id: 1, number: "001", holder: "Demo", currency: "USD", balance: "100.00" },
  { id: 2, number: "002", holder: "Demo", currency: "USD", balance: "50.00" },
  { id: 3, number: "003", holder: "Demo", currency: "EUR", balance: "10.00" },
];

const valid: TransferFormValues = { sourceId: "1", targetId: "2", amount: "10.50", description: "" };

describe("validateTransfer", () => {
  it("given valid values then returns no errors", () => {
    expect(hasErrors(validateTransfer(valid, accounts))).toBe(false);
  });

  it("given nothing selected then requires both accounts", () => {
    const errors = validateTransfer({ ...valid, sourceId: "", targetId: "" }, accounts);
    expect(errors.source).toBeDefined();
    expect(errors.target).toBeDefined();
  });

  it("given same account then target error", () => {
    expect(validateTransfer({ ...valid, targetId: "1" }, accounts).target).toContain("distinta");
  });

  it("given different currencies then target error", () => {
    expect(validateTransfer({ ...valid, targetId: "3" }, accounts).target).toContain("moneda");
  });

  it.each(["", "abc", "0", "0.00", "-5", "1.234"])("given invalid amount %s then amount error", (amount) => {
    expect(validateTransfer({ ...valid, amount }, accounts).amount).toBeDefined();
  });

  it("given amount above balance then insufficient funds", () => {
    expect(validateTransfer({ ...valid, amount: "100.01" }, accounts).amount).toContain("insuficiente");
  });

  it("given exact balance then accepted", () => {
    expect(validateTransfer({ ...valid, amount: "100.00" }, accounts).amount).toBeUndefined();
  });
});

describe("toCents", () => {
  it("converts decimals without floating point drift", () => {
    expect(toCents("0.1")).toBe(10);
    expect(toCents("1.15")).toBe(115);
    expect(toCents("7")).toBe(700);
  });
});
