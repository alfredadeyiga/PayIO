import { formatAddress } from "./formatAddress";

describe("formatAddress", () => {
  it("removes all numbers from the address", () => {
    expect(formatAddress("123 Main St")).toBe("Main St");
  });
});
