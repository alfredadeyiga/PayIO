import { formatCompact } from "./formatCompact";

describe("formatCompact", () => {
  it("displays large numbers as compact form", () => {
    expect(formatCompact(1500)).toBe("1.5K");
  });
});
