import { render, screen } from "../../../test/test-utils";
import AccountDetails from "./AccountDetails";
import { useModal } from "../../../context/ModalContext";
import { useBalances } from "../../../hooks/features/balances/useBalances";
import { useTransactions } from "../../../hooks/features/transactions/useTransactions";
import { useUpdateBalance } from "../../../hooks/features/balances/useUpdateBalance";
import { useDeleteBalance } from "../../../hooks/features/balances/useDeleteBalance";
import { useVisibleData } from "../../../hooks/useVisibleData";
import { formatCurrency } from "../../../utils/formatCurrency";
import userEvent from "@testing-library/user-event";
import { formatShortMonth } from "../../../utils/formatDate";
import { formatAccountNumber } from "../../../utils/formatAccountNumber";

vi.mock("../../../context/ModalContext");

vi.mock("../../../hooks/features/balances/useBalances");

vi.mock("../../../hooks/features/transactions/useTransactions");

vi.mock("../../../hooks/features/balances/useUpdateBalance");

vi.mock("../../../hooks/features/balances/useDeleteBalance");

vi.mock("../../../hooks/useVisibleData");

const openModal = vi.fn();

const closeModal = vi.fn();

const updateBalance = vi.fn();

const deleteBalance = vi.fn();

const navigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
  useParams: () => ({ id: "1" }),
}));

describe("AccountDetails", () => {
  const mockBalances = [
    {
      id: "1",
      service: "Visa",
      type: "Debit Card",
      total: 5000,
      branch_name: "Test Branch",
      account_number: "4111222233334444",
    },
  ];

  const mockTransactions = [
    {
      id: "1",
      transaction_type: "revenue",
      payment_id: "1",
      date: "2026-08-29",
      receipt: "aBC123",
      amount: 500,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal,
      closeModal,
    });

    vi.mocked(useBalances).mockReturnValue({
      data: mockBalances,
    });

    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });

    vi.mocked(useUpdateBalance).mockReturnValue({
      mutate: updateBalance,
    });

    vi.mocked(useDeleteBalance).mockReturnValue({
      mutate: deleteBalance,
    });

    vi.mocked(useVisibleData).mockReturnValue({
      visibleData: [],
      hasMore: false,
      loadMore: vi.fn(),
    });
  });

  it("does not render account details when account does not exist", () => {
    vi.mocked(useBalances).mockReturnValue({
      data: [],
    });

    render(<AccountDetails />);

    const accountDetails = screen.queryByText(/account details/i);
    expect(accountDetails).not.toBeInTheDocument();
  });

  it("renders account fields with card name and number when account type is card", () => {
    render(<AccountDetails />);

    const cardName = screen.getByText(/card name/i);
    expect(cardName).toBeInTheDocument();

    const cardNumber = screen.getByText(/card number/i);
    expect(cardNumber).toBeInTheDocument();

    expect(screen.getByText(mockBalances[0].service)).toBeInTheDocument();

    expect(screen.getByText(mockBalances[0].type)).toBeInTheDocument();

    expect(screen.getByText(mockBalances[0].branch_name)).toBeInTheDocument();

    expect(
      screen.getByText(
        formatAccountNumber(mockBalances[0].account_number, {
          type: mockBalances[0].type,
        }),
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`$${formatCurrency(mockBalances[0].total)}`),
    ).toBeInTheDocument();
  });

  it("renders bank name and account number when account type is not card", () => {
    vi.mocked(useBalances).mockReturnValue({
      data: [{ ...mockBalances[0], type: "Savings" }],
    });

    render(<AccountDetails />);

    const bankName = screen.getByText(/bank name/i);
    expect(bankName).toBeInTheDocument();

    const accountNumber = screen.getByText(/account number/i);
    expect(accountNumber).toBeInTheDocument();
  });

  it("calls open modal on edit button click", async () => {
    const user = userEvent.setup();

    render(<AccountDetails />);

    const editButton = screen.getByRole("button", { name: /edit balance/i });
    expect(editButton).toBeInTheDocument();
    await user.click(editButton);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("calls open modal and deletes account on remove button click", async () => {
    const user = userEvent.setup();

    openModal.mockImplementation((options) => {
      options.onConfirm();
    });

    deleteBalance.mockImplementation((_, options) => {
      options.onSuccess();
    });

    render(<AccountDetails />);

    const removeButton = screen.getByRole("button", { name: /remove/i });
    expect(removeButton).toBeInTheDocument();
    await user.click(removeButton);

    expect(openModal).toHaveBeenCalledWith(
      expect.objectContaining({
        onConfirm: expect.any(Function),
      }),
    );

    expect(deleteBalance).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );

    expect(navigate).toHaveBeenCalledWith("/dashboard/balances");
  });

  it("hides transaction history when there are no transactions", () => {
    render(<AccountDetails />);

    const txHistory = screen.queryByText(/transaction history/i);
    expect(txHistory).not.toBeInTheDocument();
  });

  it("renders transaction tables when there are transactions", () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    vi.mocked(useVisibleData).mockReturnValue({
      visibleData: mockTransactions,
    });

    render(<AccountDetails />);

    expect(
      screen.getAllByText(formatShortMonth(mockTransactions[0].date)),
    ).toHaveLength(2);

    expect(screen.getAllByText(/credit/i)).toHaveLength(2);

    expect(screen.getAllByText(mockTransactions[0].receipt)).toHaveLength(2);

    expect(
      screen.getAllByText(`$${formatCurrency(mockTransactions[0].amount)}`),
    ).toHaveLength(2);
  });

  it("hides load more button by default", () => {
    render(<AccountDetails />);

    const loadButton = screen.queryByRole("button", { name: /load more/i });
    expect(loadButton).not.toBeInTheDocument();
  });

  it("renders and calls load more when hasMore is true", async () => {
    const user = userEvent.setup();

    const loadMore = vi.fn();

    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    vi.mocked(useVisibleData).mockReturnValue({
      hasMore: true,
      loadMore,
    });

    render(<AccountDetails />);

    const loadButton = screen.getByRole("button", { name: /load more/i });
    expect(loadButton).toBeInTheDocument();
    await user.click(loadButton);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });
});
