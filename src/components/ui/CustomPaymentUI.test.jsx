import { render, screen } from "../../test/test-utils";
import CustomPaymentUI from "./CustomPaymentUI";

describe("CustomPaymentUI", () => {
  const mockBalance = {
    account_number: "1234567890",
    type: "Investment",
  };

  it("renders balance icon when it exists", () => {
    const balance = { ...mockBalance, icon: "balance.png" };

    render(<CustomPaymentUI balance={balance} />);

    const icon = screen.getByAltText("icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", expect.stringContaining("balance"));
  });

  it("hides image element when no icon exists", () => {
    render(<CustomPaymentUI balance={mockBalance} />);

    const icon = screen.queryByRole("img");
    expect(icon).not.toBeInTheDocument();
  });

  it("renders balance type", () => {
    render(<CustomPaymentUI balance={mockBalance} />);

    const type = screen.getByText(/investment/i);
    expect(type).toBeInTheDocument();
  });

  it("renders the last four digits", () => {
    render(<CustomPaymentUI balance={mockBalance} />);

    const lastFour = screen.getByText(/7890/i);
    expect(lastFour).toBeInTheDocument();
  });
});
