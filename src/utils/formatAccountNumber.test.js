import { formatAccountNumber } from "./formatAccountNumber";

describe("formatAccountNumber", () => {
  it("returns an empty string when there is no account number", () => {
    expect(formatAccountNumber(null, { type: "Credit Card" })).toBe("");
  });

  it("displays number with card format when type is card", () => {
    expect(
      formatAccountNumber("1234567890123456", {
        type: "Credit Card",
        masked: false,
      }),
    ).toBe("1234 5678 9012 3456");
  });

  it("displays number with account format when type is not card", () => {
    expect(
      formatAccountNumber("1234567890", {
        type: "Savings",
        masked: false,
      }),
    ).toBe("123 456 7890");
  });

  it("masks the last four digits when masked is true", () => {
    expect(
      formatAccountNumber("1234567890", {
        type: "Savings",
        masked: true,
      }),
    ).toBe("123 456 ****");
  });
});
