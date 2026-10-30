import { generateReceipt } from "./generateReceipt";

describe("generateReceipt", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a receipt identifier with 11 characters", () => {
    expect(generateReceipt()).toHaveLength(11);
  });

  it("starts with a digit between 0 and 8", () => {
    const receipt = generateReceipt();

    expect(receipt[0]).toMatch(/[0-8]/);
  });

  it("contains only letters and digits", () => {
    expect(generateReceipt()).toMatch(/^[0-9][A-Za-z0-9]{10}$/);
  });
});
