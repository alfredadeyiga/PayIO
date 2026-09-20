import { render, screen } from "../../../../test/test-utils";
import Recents from "./Recents";
import { useModal } from "../../../../context/ModalContext";
import userEvent from "@testing-library/user-event";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useTransactions } from "../../../../hooks/features/transactions/useTransactions";
import { formatShortMonth } from "../../../../utils/formatDate";
import { useFilteredTransactions } from "../../../../hooks/useFilteredTransactions";
import { defaultTabs } from "../../../../constants/defaultTabs";

vi.mock("../../../../context/ModalContext");

vi.mock("../../../../hooks/features/transactions/useTransactions");

vi.mock("../../../../hooks/useFilteredTransactions");

const openModal = vi.fn();

describe("Recents", () => {
  const mockTransactions = [
    {
      id: "1",
      item_name: "Groceries",
      shop_name: "Fmart",
      amount: 500,
      category: "shopping",
      date: "2026-09-15",
    },
    {
      id: "2",
      item_name: "Rent",
      shop_name: "Accom",
      amount: 900,
      category: "housing",
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

    vi.mocked(useFilteredTransactions).mockReturnValue(mockTransactions);
  });

  it("renders empty state when there is no data", () => {
    vi.mocked(useFilteredTransactions).mockReturnValue([]);

    render(<Recents />);

    expect(screen.getByText(/add recent transactions/i)).toBeInTheDocument();
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    vi.mocked(useFilteredTransactions).mockReturnValue([]);

    render(<Recents />);

    const emptyState = screen.getByRole("button", {
      name: /add recent transactions/i,
    });
    await user.click(emptyState);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders default fields when there is data", () => {
    render(<Recents />);

    defaultTabs.forEach((tab) =>
      expect(screen.getByText(tab)).toBeInTheDocument(),
    );

    mockTransactions.forEach((tx) => {
      expect(screen.getByText(tx.item_name)).toBeInTheDocument();

      expect(screen.getByText(tx.shop_name)).toBeInTheDocument();

      expect(screen.getByText(formatShortMonth(tx.date))).toBeInTheDocument();

      expect(
        screen.getByText(`$${formatCurrency(tx.amount)}`),
      ).toBeInTheDocument();
    });
  });
});
