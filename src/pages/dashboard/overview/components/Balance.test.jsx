import { render, screen } from "../../../../test/test-utils";
import Balance from "./Balance";
import { useModal } from "../../../../context/ModalContext";
import userEvent from "@testing-library/user-event";
import { useBalances } from "../../../../hooks/features/balances/useBalances";
import { formatCurrencyRounded } from "../../../../utils/formatCurrency";
import { formatAccountNumber } from "../../../../utils/formatAccountNumber";

vi.mock("../../../../context/ModalContext");

vi.mock("../../../../hooks/features/balances/useBalances");

const openModal = vi.fn();

describe("Balance", () => {
  const mockBalances = [
    {
      id: "1",
      account_number: "0000111122223333",
      type: "Credit Card",
      total: 25000,
      icon: "/visa.png",
    },
    { id: "2", account_number: "0123456789", type: "Savings", total: 20000 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    vi.mocked(useBalances).mockReturnValue({
      data: mockBalances,
    });
  });

  it("renders empty state when there is no data", () => {
    vi.mocked(useBalances).mockReturnValue({
      data: [],
    });

    render(<Balance />);

    expect(screen.getByText(/add card to show balance/i)).toBeInTheDocument();
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    vi.mocked(useBalances).mockReturnValue({
      data: [],
    });

    render(<Balance />);

    const emptyState = screen.getByRole("button", {
      name: /add card to show balance/i,
    });
    await user.click(emptyState);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders default fields when there is data", () => {
    render(<Balance />);

    expect(screen.getByText(/all accounts/i)).toBeInTheDocument();

    expect(
      screen.getByText(`$${formatCurrencyRounded(45000)}`),
    ).toBeInTheDocument();

    mockBalances.forEach((balance, index) => {
      expect(screen.getByText(balance.type)).toBeInTheDocument();

      expect(
        screen.getByText(
          formatAccountNumber(balance.account_number, { type: balance.type }),
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(`$${formatCurrencyRounded(balance.total)}`),
      ).toBeInTheDocument();

      expect(screen.getByTestId(`dot-${index}`)).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("renders logo with balance icon when balance type is card", () => {
    vi.mocked(useBalances).mockReturnValue({
      data: [mockBalances[0]],
    });

    render(<Balance />);

    expect(screen.getByAltText("logo")).toHaveAttribute(
      "src",
      mockBalances[0].icon,
    );
  });

  it("does not render logo when balance type is not card", () => {
    vi.mocked(useBalances).mockReturnValue({
      data: [mockBalances[1]],
    });

    render(<Balance />);

    expect(screen.queryByAltText("logo")).not.toBeInTheDocument();
  });

  it("moves to the next balance when next is clicked", async () => {
    const user = userEvent.setup();

    render(<Balance />);

    const next = screen.getByRole("button", { name: /next/i });
    await user.click(next);

    expect(screen.getByTestId("dot-1")).toHaveClass("bg-primary");
  });

  it("moves to the previous balance when previous is clicked", async () => {
    const user = userEvent.setup();

    render(<Balance />);

    const next = screen.getByRole("button", { name: /next/i });
    await user.click(next);

    const previous = screen.getByRole("button", { name: /previous/i });
    await user.click(previous);

    expect(screen.getByTestId("dot-0")).toHaveClass("bg-primary");
  });

  it("moves to the selected balance when a dot is clicked", async () => {
    const user = userEvent.setup();

    render(<Balance />);

    await user.click(screen.getByTestId("dot-1"));

    expect(screen.getByTestId("dot-1")).toHaveClass("bg-primary");
  });
});
