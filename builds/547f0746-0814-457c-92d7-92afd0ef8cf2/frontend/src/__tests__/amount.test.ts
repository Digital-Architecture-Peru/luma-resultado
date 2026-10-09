import { describe, expect, it } from "vitest";
import { isValidAmount } from "../lib/amount";

describe("isValidAmount", () => {
  it.each(["1", "10.5", "0.01", "1500.25"])("given %s then valid", (value) => {
    expect(isValidAmount(value)).toBe(true);
  });

  it.each(["", "0", "0.00", "-5", "abc", "1.234", "1,5", " 1"])("given '%s' then invalid", (value) => {
    expect(isValidAmount(value)).toBe(false);
  });
});
