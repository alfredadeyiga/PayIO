import { formatCapitalize } from "./formatCapitalize";

describe("formatCapitalize", () => {
  it("capitalizes the first letter", () => {
    expect(formatCapitalize("bank")).toBe("Bank");
  });
});
