import { generateCard, getCardTypes } from "./cards";

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn().mockReturnThis(),
    get: getMock,
  },
}));

describe("generateCard", () => {
  it("requests a card using the specified type and returns the response data", async () => {
    const card = { number: "123456789", type: "visa" };

    getMock.mockResolvedValue({ data: card });

    const result = await generateCard("visa");

    expect(getMock).toHaveBeenCalledWith("/generate?type=visa");

    expect(result).toEqual(card);
  });
});

describe("getCardTypes", () => {
  it("requests the available card types and returns the response data", async () => {
    const types = ["visa", "mastercard"];

    getMock.mockResolvedValue({ data: types });

    const result = await getCardTypes();

    expect(getMock).toHaveBeenCalledWith("/types");

    expect(result).toEqual(types);
  });
});
