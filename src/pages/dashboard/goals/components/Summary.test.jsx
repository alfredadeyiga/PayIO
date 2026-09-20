import { render, screen } from "../../../../test/test-utils";
import Summary from "./Summary";
import { useModal } from "../../../../context/ModalContext";
import userEvent from "@testing-library/user-event";
import { formatPeriod, getCurrentPeriod } from "../../../../utils/formatDate";
import { useTransactions } from "../../../../hooks/features/transactions/useTransactions";

vi.mock("../../../../context/ModalContext");

vi.mock("../../../../hooks/features/transactions/useTransactions");

vi.mock("../../../../components/ui/SavingsCard", () => ({
  default: () => <div>Savings Card</div>,
}));

vi.mock("../../../../components/ui/SavingsChart", () => ({
  default: () => <div>Savings Chart</div>,
}));

const openModal = vi.fn();

describe("Summary", () => {
  const currentPeriod = getCurrentPeriod();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    vi.mocked(useTransactions).mockReturnValue({
      data: [{ id: "1", date: "2026-09-09" }],
    });
  });

  it("renders empty state when there is no data", () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });

    render(<Summary />);

    expect(
      screen.getByText(/add transactions to see chart data/i),
    ).toBeInTheDocument();
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });

    render(<Summary />);

    const emptyState = screen.getByRole("button", {
      name: /add transactions to see chart data/i,
    });
    await user.click(emptyState);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders default fields when there is data", () => {
    render(<Summary />);

    expect(screen.getByText(/savings summary/i)).toBeInTheDocument();

    expect(screen.getByText(formatPeriod(currentPeriod))).toBeInTheDocument();

    expect(screen.getByText("Savings Card")).toBeInTheDocument();

    expect(screen.getByText("Savings Chart")).toBeInTheDocument();

    expect(screen.queryByTestId(/dropdown/i)).not.toBeInTheDocument();
  });

  it("renders dropdown on dropdown toggle", async () => {
    const user = userEvent.setup();

    render(<Summary />);

    const dropdownToggle = screen.getByLabelText(/toggle summary dropdown/i);
    await user.click(dropdownToggle);

    expect(screen.getByTestId(/dropdown/i)).toBeInTheDocument();
  });

  it("changes selected option and hides dropdown on current period change", async () => {
    const user = userEvent.setup();

    const mockData = [{ id: "1", date: "2026-08-09" }];

    vi.mocked(useTransactions).mockReturnValue({
      data: mockData,
    });

    const period = formatPeriod(mockData[0].date);

    render(<Summary />);

    const dropdownToggle = screen.getByLabelText(/toggle summary dropdown/i);
    await user.click(dropdownToggle);

    const periodButton = screen.getByRole("button", { name: period });
    await user.click(periodButton);

    expect(screen.getByText(period)).toBeInTheDocument();

    expect(screen.queryByTestId(/dropdown/i)).not.toBeInTheDocument();
  });
});
