import { describe, expect, it } from "vitest";
import { formatDate, formatMoney } from "./format";

describe("formatMoney", () => {
  it("given a decimal string, when formatted, then includes grouped digits and decimals", () => {
    expect(formatMoney("1234.50", "PEN")).toMatch(/1[\s,.\u00a0]?234[.,]50/);
  });

  it("given a non numeric value, when formatted, then returns the original text", () => {
    expect(formatMoney("abc", "PEN")).toBe("abc");
  });
});

describe("formatDate", () => {
  it("given an invalid date, when formatted, then returns the original text", () => {
    expect(formatDate("no-fecha")).toBe("no-fecha");
  });

  it("given an ISO date, when formatted, then contains the year", () => {
    expect(formatDate("2021-03-15")).toContain("2021");
  });
});
