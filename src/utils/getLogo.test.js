import { getLogo } from "./getLogo";

describe("getLogo", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_LOGO_DEV_API_KEY", "test-api-key");
  });

  it("returns the correct logo URL with the API key", () => {
    expect(getLogo("Apple")).toBe(
      "https://img.logo.dev/name/Apple?token=test-api-key&format=webp&retina=true",
    );
  });

  it("encodes special characters in the value", () => {
    expect(getLogo("Bank & Trust")).toBe(
      "https://img.logo.dev/name/Bank%20%26%20Trust?token=test-api-key&format=webp&retina=true",
    );
  });
});
