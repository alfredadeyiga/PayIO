import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test/test-utils";
import Transactions from "./Transactions";
import { useModal } from "../../../context/ModalContext";
import { useTransactions } from "../../../hooks/features/transactions/useTransactions";
import { useDeleteTransaction } from "../../../hooks/features/transactions/useDeleteTransaction";
import { useFilteredTransactions } from "../../../hooks/useFilteredTransactions";
import { useVisibleData } from "../../../hooks/useVisibleData";
import { formatShortMonth } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";

vi.mock("../../../context/ModalContext");

vi.mock("../../../hooks/features/transactions/useTransactions");

vi.mock("../../../hooks/features/transactions/useDeleteTransaction");

vi.mock("../../../hooks/useFilteredTransactions");

vi.mock("../../../hooks/useVisibleData");

const openModal = vi.fn();

const mutate = vi.fn();

describe("Transactions", () => {
  const mockTransactions = [
    {
      id: "1",
      item_name: "Groceries",
      shop_name: "Fmart",
      amount: 500,
      category: "shopping",
      payment_method: "Savings",
      date: "2026-09-15",
    },
    {
      id: "2",
      item_name: "Rent",
      shop_name: "Accom",
      amount: 900,
      category: "housing",
      payment_method: "Credit Card",
      date: "2026-09-10",
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

    vi.mocked(useDeleteTransaction).mockReturnValue({
      mutate,
    });

    vi.mocked(useFilteredTransactions).mockReturnValue(mockTransactions);

    vi.mocked(useVisibleData).mockReturnValue({
      visibleData: mockTransactions,
      hasMore: false,
      loadMore: vi.fn(),
    });
  });

  it("renders empty state when there is no data", () => {
    vi.mocked(useFilteredTransactions).mockReturnValue({
      data: [],
    });

    render(<Transactions />);

    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    vi.mocked(useFilteredTransactions).mockReturnValue({
      data: [],
    });

    render(<Transactions />);

    const emptyState = screen.getByRole("button", {
      name: /no transactions yet/i,
    });
    await user.click(emptyState);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders default fields when there is data", () => {
    render(<Transactions />);

    mockTransactions.forEach((tx) => {
      expect(screen.getAllByText(tx.item_name)).toHaveLength(2);

      expect(screen.getAllByText(tx.shop_name)).toHaveLength(2);

      expect(screen.getAllByText(tx.payment_method)).toHaveLength(2);

      expect(screen.getAllByText(formatShortMonth(tx.date))).toHaveLength(2);

      expect(screen.getAllByText(`$${formatCurrency(tx.amount)}`)).toHaveLength(
        2,
      );
    });
  });

  it("hides load more button by default", () => {
    render(<Transactions />);

    expect(
      screen.queryByRole("button", { name: /load more/i }),
    ).not.toBeInTheDocument();
  });

  it("renders and calls load more when hasMore is true", async () => {
    const user = userEvent.setup();

    const loadMore = vi.fn();

    vi.mocked(useVisibleData).mockReturnValue({
      hasMore: true,
      loadMore,
    });

    render(<Transactions />);

    const loadButton = screen.getByRole("button", { name: /load more/i });
    expect(loadButton).toBeInTheDocument();
    await user.click(loadButton);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it("calls open modal on add transaction", async () => {
    const user = userEvent.setup();

    render(<Transactions />);

    const addTx = screen.getByRole("button", { name: /add transaction/i });
    expect(addTx).toBeInTheDocument();
    await user.click(addTx);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });
});
