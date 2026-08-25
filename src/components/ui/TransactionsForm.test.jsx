import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import TransactionsForm from "./TransactionsForm";
import { useModal } from "../../context/ModalContext";
import { useTransactions } from "../../hooks/features/transactions/useTransactions";
import { useAddTransaction } from "../../hooks/features/transactions/useAddTransaction";
import { useUpdateTransaction } from "../../hooks/features/transactions/useUpdateTransaction";
import { useBalances } from "../../hooks/features/balances/useBalances";
import { useUpdateBalance } from "../../hooks/features/balances/useUpdateBalance";
import { generateReceipt } from "../../utils/generateReceipt";
import { toast } from "react-toastify";

vi.mock("../../context/ModalContext");

vi.mock("../../hooks/features/transactions/useTransactions");

vi.mock("../../hooks/features/transactions/useAddTransaction");

vi.mock("../../hooks/features/transactions/useUpdateTransaction");

vi.mock("../../hooks/features/balances/useBalances");

vi.mock("../../hooks/features/balances/useUpdateBalance");

vi.mock("../../utils/generateReceipt");

vi.mock("react-toastify", () => ({
  toast: { info: vi.fn() },
}));

const addTransaction = vi.fn();

const updateTransaction = vi.fn();

const updateBalance = vi.fn();

describe("TransactionsForm", () => {
  const mockBalances = [{ id: "1", type: "Debit Card", total: 1500 }];

  const mockTransactions = [
    {
      id: "1",
      item_name: "Groceries",
      shop_name: "Fmart",
      amount: 500,
      transaction_type: "expenses",
      category: "shopping",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      isLoading: false,
    });

    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });

    vi.mocked(useAddTransaction).mockReturnValue({
      mutate: addTransaction,
    });

    vi.mocked(useUpdateTransaction).mockReturnValue({
      mutate: updateTransaction,
    });

    vi.mocked(useBalances).mockReturnValue({
      data: [],
    });

    vi.mocked(useUpdateBalance).mockReturnValue({
      mutate: updateBalance,
    });
  });

  it("renders default fields", () => {
    render(<TransactionsForm />);

    const itemName = screen.getByRole("textbox", { name: /item name/i });
    expect(itemName).toBeInTheDocument();

    const category = screen.getByRole("heading", { name: /category/i });
    expect(category).toBeInTheDocument();

    const shopName = screen.getByRole("textbox", { name: /shop name/i });
    expect(shopName).toBeInTheDocument();

    const transactionType = screen.getByRole("heading", {
      name: /transaction type/i,
    });
    expect(transactionType).toBeInTheDocument();

    const paymentMethod = screen.getByRole("heading", {
      name: /payment method/i,
    });
    expect(paymentMethod).toBeInTheDocument();

    const amount = screen.getByRole("spinbutton", { name: /amount/i });
    expect(amount).toBeInTheDocument();
  });

  it("requires input fields by default", () => {
    render(<TransactionsForm />);

    const itemName = screen.getByRole("textbox", { name: /item name/i });
    expect(itemName).toBeRequired();

    const shopName = screen.getByRole("textbox", { name: /shop name/i });
    expect(shopName).toBeRequired();

    const amount = screen.getByRole("spinbutton", { name: /amount/i });
    expect(amount).toBeRequired();
  });

  it("hides payment method when there is currentId", () => {
    render(<TransactionsForm currentId="1" />);

    const paymentMethod = screen.queryByRole("heading", {
      name: /payment method/i,
    });
    expect(paymentMethod).not.toBeInTheDocument();
  });

  it("renders placeholders with current transaction when updating transaction", () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    render(<TransactionsForm currentId="1" />);

    const itemPlaceholder = screen.getByPlaceholderText(/groceries/i);
    expect(itemPlaceholder).toBeInTheDocument();

    const shopPlaceholder = screen.getByPlaceholderText(/fmart/i);
    expect(shopPlaceholder).toBeInTheDocument();

    const amountPlaceholder = screen.getByPlaceholderText(/\$500/i);
    expect(amountPlaceholder).toBeInTheDocument();
  });

  it("adds a new transaction and updates balance total on success", async () => {
    vi.mocked(useBalances).mockReturnValue({
      data: mockBalances,
    });

    addTransaction.mockImplementation((_, options) => {
      options.onSuccess();
    });

    const user = userEvent.setup();

    render(<TransactionsForm />);

    const itemName = screen.getByRole("textbox", { name: /item name/i });
    await user.type(itemName, "PS5");

    const shopName = screen.getByRole("textbox", { name: /shop name/i });
    await user.type(shopName, "Sony");

    const amount = screen.getByRole("spinbutton", { name: /amount/i });
    await user.type(amount, "500");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(addTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        item_name: "PS5",
        shop_name: "Sony",
        amount: 500,
        transaction_type: "revenue",
      }),
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );

    expect(generateReceipt).toHaveBeenCalledTimes(1);

    expect(updateBalance).toHaveBeenCalledWith({ id: "1", total: 2000 });
  });

  it("updates only changed values in current transaction with currentId", async () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    vi.mocked(useBalances).mockReturnValue({
      data: mockBalances,
    });

    updateTransaction.mockImplementation((_, options) => {
      options.onSuccess();
    });

    const user = userEvent.setup();

    render(<TransactionsForm currentId="1" />);

    const amount = screen.getByRole("spinbutton", { name: /amount/i });
    await user.type(amount, "600");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(updateTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        updates: { amount: 600 },
      }),
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );

    expect(updateBalance).toHaveBeenCalledWith({ id: "1", total: 1400 });
  });

  it("updates transaction type and balance total", async () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    vi.mocked(useBalances).mockReturnValue({
      data: mockBalances,
    });

    updateTransaction.mockImplementation((_, options) => {
      options.onSuccess();
    });

    const user = userEvent.setup();

    render(<TransactionsForm currentId="1" />);

    const transactionSelect = screen.getByLabelText(/transaction type/i);
    await user.click(transactionSelect);

    const dropdownSelect = screen.getByLabelText(/revenue/i);
    await user.click(dropdownSelect);

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(updateTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        updates: { transaction_type: "revenue" },
      }),
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );

    expect(updateBalance).toHaveBeenCalledWith({ id: "1", total: 2500 });
  });

  it("shows a toast info when no changes to the current transaction", async () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    const user = userEvent.setup();

    render(<TransactionsForm currentId="1" />);

    const amount = screen.getByRole("spinbutton", { name: /amount/i });
    await user.type(amount, "500");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(toast.info).toHaveBeenCalledTimes(1);

    expect(updateTransaction).not.toHaveBeenCalled();
  });

  it("shows a toast info when updated balance is less than zero", async () => {
    vi.mocked(useTransactions).mockReturnValue({
      data: mockTransactions,
    });

    vi.mocked(useBalances).mockReturnValue({
      data: mockBalances,
    });

    const user = userEvent.setup();

    render(<TransactionsForm currentId="1" />);

    const amount = screen.getByRole("spinbutton", { name: /amount/i });
    await user.type(amount, "2500");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(toast.info).toHaveBeenCalledTimes(1);

    expect(updateTransaction).not.toHaveBeenCalled();
  });
});
