import "./chunk-WNHUKSQP.js";

// src/app/core/notification-format.spec.ts
import { describe, expect, it } from "vitest";

// src/app/core/notification-format.ts
var TYPE_LABELS = {
  DEPOSIT: "Dep\xF3sito",
  WITHDRAWAL: "Retiro",
  LOW_BALANCE: "Saldo bajo"
};
function typeLabel(type) {
  return TYPE_LABELS[type];
}
function formatAmount(amount, currency) {
  if (amount === null || currency === null) {
    return null;
  }
  return new Intl.NumberFormat("es", { style: "currency", currency }).format(amount);
}

// src/app/core/notification-format.spec.ts
describe("notification-format", () => {
  it("given each type when typeLabel then returns Spanish label", () => {
    expect(typeLabel("DEPOSIT")).toBe("Dep\xF3sito");
    expect(typeLabel("WITHDRAWAL")).toBe("Retiro");
    expect(typeLabel("LOW_BALANCE")).toBe("Saldo bajo");
  });
  it("given no amount when formatAmount then returns null", () => {
    expect(formatAmount(null, null)).toBeNull();
    expect(formatAmount(10, null)).toBeNull();
  });
  it("given amount and currency when formatAmount then includes the decimal amount", () => {
    expect(formatAmount(25, "USD")).toContain("25,00");
  });
});
//# sourceMappingURL=spec-notification-format.spec.js.map
