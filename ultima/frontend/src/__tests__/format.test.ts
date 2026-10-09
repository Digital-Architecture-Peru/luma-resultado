import { describe, expect, it } from "vitest";
import { formatAmount, statusLabel, typeLabel } from "../utils/format";

describe("format", () => {
  it("given a CLP amount when formatted then uses thousand separators", () => {
    expect(formatAmount(1350000, "CLP")).toMatch(/1\.350\.000/);
  });

  it("given a USD amount when formatted then keeps two decimals", () => {
    expect(formatAmount(1200.75, "USD")).toMatch(/1\.200,75/);
  });

  it("given statuses and types when labelled then returns Spanish text", () => {
    expect(statusLabel("BLOCKED")).toBe("Bloqueada");
    expect(typeLabel("DEBIT")).toBe("Débito");
  });
});
