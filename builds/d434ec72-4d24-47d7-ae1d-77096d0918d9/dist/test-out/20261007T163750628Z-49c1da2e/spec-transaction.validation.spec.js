import {
  parseAmount,
  validateTransaction
} from "./chunk-RUOCWWY3.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-RSTWSNOR.js";

// src/app/domain/transaction.validation.spec.ts
import { describe, expect, it } from "vitest";
var card = {
  id: "c1",
  alias: "Test",
  maskedNumber: "**** 0000",
  currency: "PEN",
  creditLimit: 1e3,
  availableCredit: 600,
  status: "ACTIVE"
};
function request(overrides = {}) {
  return __spreadValues({ cardId: "c1", type: "PURCHASE", amount: 100, description: "Supermercado" }, overrides);
}
describe("parseAmount", () => {
  it("given a dot or comma decimal when parsed then returns the number", () => {
    expect(parseAmount("10.50")).toBe(10.5);
    expect(parseAmount(" 10,5 ")).toBe(10.5);
  });
  it("given invalid text when parsed then returns NaN", () => {
    expect(parseAmount("abc")).toBeNaN();
    expect(parseAmount("1.234")).toBeNaN();
    expect(parseAmount("-5")).toBeNaN();
    expect(parseAmount("")).toBeNaN();
  });
});
describe("validateTransaction", () => {
  it("given a valid purchase then there are no errors", () => {
    expect(validateTransaction(request(), card)).toEqual([]);
  });
  it("given no card then asks to select one", () => {
    expect(validateTransaction(request(), void 0)).toEqual(["Selecciona una tarjeta v\xE1lida."]);
  });
  it("given a blocked card then rejects", () => {
    const errors = validateTransaction(request(), __spreadProps(__spreadValues({}, card), { status: "BLOCKED" }));
    expect(errors).toContain("La tarjeta est\xE1 bloqueada y no admite operaciones.");
  });
  it("given NaN or zero amount then rejects", () => {
    expect(validateTransaction(request({ amount: Number.NaN }), card).length).toBe(1);
    expect(validateTransaction(request({ amount: 0 }), card).length).toBe(1);
  });
  it("given a purchase above available credit then rejects", () => {
    expect(validateTransaction(request({ amount: 601 }), card)).toContain("El monto excede el cr\xE9dito disponible.");
  });
  it("given a purchase above the per-transaction limit then rejects", () => {
    const rich = __spreadProps(__spreadValues({}, card), { creditLimit: 99999, availableCredit: 99999 });
    expect(validateTransaction(request({ amount: 5001 }), rich)[0]).toContain("monto m\xE1ximo");
  });
  it("given a payment above the debt then rejects, and equal to the debt then accepts", () => {
    expect(validateTransaction(request({ type: "PAYMENT", amount: 401 }), card)).toContain("El pago excede la deuda actual de la tarjeta.");
    expect(validateTransaction(request({ type: "PAYMENT", amount: 400 }), card)).toEqual([]);
  });
  it("given a too short description then rejects", () => {
    expect(validateTransaction(request({ description: " a " }), card)[0]).toContain("descripci\xF3n");
  });
});
//# sourceMappingURL=spec-transaction.validation.spec.js.map
