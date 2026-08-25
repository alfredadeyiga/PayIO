import { render, screen } from "../../test/test-utils";
import { getLogo } from "../../utils/getLogo";
import CustomCardUI from "./CustomCardUI";

vi.mock("../../utils/getLogo");

describe("CustomCardUI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders its default fields", () => {
    const mockValue = "MasterCard";

    render(<CustomCardUI value={mockValue} />);

    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();

    expect(getLogo).toHaveBeenCalledWith(mockValue);

    const value = screen.getByText(mockValue);
    expect(value).toBeInTheDocument();
  });
});
