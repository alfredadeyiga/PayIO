import { render, screen } from "../../test/test-utils";
import { formatCurrencyRounded } from "../../utils/formatCurrency";
import CustomToolTip from "./CustomToolTip";

describe("CustomToolTip", () => {
  const mockPayload = [{ value: 1500 }];

  it("renders tooltip when active and payload is passed", () => {
    const label = "Jul 29";

    render(<CustomToolTip active payload={mockPayload} label={label} />);

    const tooltip = screen.getByTestId(/tooltip/i);
    expect(tooltip).toBeInTheDocument();

    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();

    const value = screen.getByText(
      `$${formatCurrencyRounded(mockPayload[0].value)}`,
    );
    expect(value).toBeInTheDocument();
  });

  it("renders data date when label is null", () => {
    const data = [{ date: "Jul 29" }];

    render(<CustomToolTip active payload={mockPayload} data={data} />);

    const dateElement = screen.getByText(data[0].date);
    expect(dateElement).toBeInTheDocument();
  });

  it("renders nothing when inactive", () => {
    const { container } = render(<CustomToolTip />);

    expect(container).toBeEmptyDOMElement();
  });
});
