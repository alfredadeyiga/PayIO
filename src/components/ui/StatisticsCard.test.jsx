import { render, screen } from "../../test/test-utils";
import StatisticsCard from "./StatisticsCard";
import userEvent from "@testing-library/user-event";
import { useTransactions } from "../../hooks/features/transactions/useTransactions";
import { useModal } from "../../context/ModalContext";

vi.mock("../../hooks/features/transactions/useTransactions");

vi.mock("../../context/ModalContext");

const openModal = vi.fn();

describe("StatisticsCard", () => {
  const mockTransactions = [
    {
      id: "1",
      transaction_type: "revenue",
      amount: 500,
      date: "2026-08-13",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });
  });

  it("renders empty state when there are no transactions", () => {
    render(<StatisticsCard selectedOption="weekly" />);

    const emptyState = screen.getByText(
      /add transactions to see statistics data/i,
    );
    expect(emptyState).toBeInTheDocument();

    const selectedLabel = screen.queryByText(/weekly comparison/i);
    expect(selectedLabel).not.toBeInTheDocument();
  });

  it("calls openModal on empty state action click", async () => {
    const user = userEvent.setup();

    render(<StatisticsCard />);

    const actionButton = screen.getByRole("button", {
      name: /add transactions/i,
    });
    await user.click(actionButton);

    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it("renders statistics when transactions exist", () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    render(<StatisticsCard selectedOption="weekly" />);

    const selectedLabel = screen.getByText(/weekly comparison/i);
    expect(selectedLabel).toBeInTheDocument();

    const amount = screen.getByText(/\+\$500/i);
    expect(amount).toBeInTheDocument();
  });

  it("hides dropdown by default", () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    render(<StatisticsCard />);

    const dropdown = screen.queryByTestId(/dropdown/i);
    expect(dropdown).not.toBeInTheDocument();
  });

  it("renders dropdown and options on button click", async () => {
    const user = userEvent.setup();

    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    render(<StatisticsCard selectedOption="weekly" />);

    const button = screen.getByRole("button", { name: /weekly comparison/i });
    expect(button).toBeInTheDocument();
    await user.click(button);

    const dropdown = screen.getByTestId(/dropdown/i);
    expect(dropdown).toBeInTheDocument();

    const option = screen.getByText(/monthly comparison/i);
    expect(option).toBeInTheDocument();
  });

  it("hides dropdown and sets selected option on option button click", async () => {
    const user = userEvent.setup();
    const setSelectedOption = vi.fn();

    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    render(
      <StatisticsCard
        selectedOption="weekly"
        setSelectedOption={setSelectedOption}
      />,
    );

    const button = screen.getByRole("button", { name: /weekly comparison/i });
    await user.click(button);

    const monthlyOption = screen.getByRole("button", { name: /monthly/i });
    await user.click(monthlyOption);

    expect(setSelectedOption).toHaveBeenCalledWith("monthly");

    const dropdown = screen.queryByTestId(/dropdown/i);
    expect(dropdown).not.toBeInTheDocument();
  });
});
