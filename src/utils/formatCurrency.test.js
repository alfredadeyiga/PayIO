import { formatCompact } from "./formatCompact";
import { formatCurrency, formatCurrencyRounded } from "./formatCurrency";

describe("formatCurrency", () => {
  it("displays currency with fraction digits", () => {
    expect(formatCurrency(1500)).toBe("1,500.00");
  });

  it("handles NaN inputs", () => {
    expect(formatCurrency("$1500")).toBe("0.00");
  });

  it("compacts currency when value >= 1_000_000", () => {
    const limit = 1_000_000;

    expect(formatCurrency(limit)).toBe(formatCompact(limit));
  });
});

describe("formatCurrencyRounded", () => {
  it("rounds decimal values correctly", () => {
    expect(formatCurrencyRounded(1500.75)).toBe("1,501");
  });

  it("handles NaN inputs", () => {
    expect(formatCurrencyRounded("$1500")).toBe("0.00");
  });

  it("compacts currency when value >= 10_000_000", () => {
    const limit = 10_000_000;

    expect(formatCurrencyRounded(limit)).toBe(formatCompact(limit));
  });
});
