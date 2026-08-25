import { render, screen, waitFor } from "../../test/test-utils";
import BalanceForm from "./BalanceForm";
import userEvent from "@testing-library/user-event";
import { generateCard, getCardTypes } from "../../api/cards";
import { toast } from "react-toastify";
import { useAddBalance } from "../../hooks/features/balances/useAddBalance";
import { faker } from "@faker-js/faker";

vi.mock("../../hooks/features/balances/useAddBalance");

vi.mock("../../api/cards");

vi.mock("../../context/ModalContext", () => ({
  useModal: () => ({
    setModalState: vi.fn(),
  }),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("@faker-js/faker", () => ({
  faker: {
    finance: {
      accountNumber: vi.fn(),
    },
    location: {
      streetAddress: vi.fn(),
    },
  },
}));

const mutate = vi.fn();

describe("BalanceForm", () => {
  const mockCards = [
    {
      key: "visa",
      name: "Visa",
    },
    {
      key: "amex",
      name: "American Express",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAddBalance).mockReturnValue({
      mutate,
    });
  });

  it("renders the default fields", () => {
    render(<BalanceForm />);

    const accountField = screen.getByRole("heading", { name: /account/i });
    expect(accountField).toBeInTheDocument();

    const cardField = screen.getByRole("heading", { name: /card/i });
    expect(cardField).toBeInTheDocument();

    const bankField = screen.queryByLabelText(/bank/i);
    expect(bankField).not.toBeInTheDocument();

    const balanceField = screen.getByLabelText(/balance/i);
    expect(balanceField).toBeInTheDocument();
  });

  it("shows the service input when a bank account is selected", async () => {
    const user = userEvent.setup();

    render(<BalanceForm />);

    const accountSelect = screen.getByLabelText(/account/i);
    expect(accountSelect).toBeInTheDocument();
    await user.click(accountSelect);

    const dropdownSelect = screen.getByLabelText(/savings/i);
    expect(dropdownSelect).toBeInTheDocument();
    await user.click(dropdownSelect);

    const serviceInput = screen.getByLabelText(/bank/i);
    expect(serviceInput).toBeInTheDocument();

    const cardField = screen.queryByRole("heading", { name: /card/i });
    expect(cardField).not.toBeInTheDocument();
  });

  it("loads card types on mount", async () => {
    const user = userEvent.setup();

    vi.mocked(getCardTypes).mockResolvedValueOnce({
      types: mockCards,
    });

    render(<BalanceForm />);

    await waitFor(() => expect(getCardTypes).toHaveBeenCalledTimes(1));

    const cardSelect = screen.getByLabelText(/card/i);
    expect(cardSelect).toBeInTheDocument();
    await user.click(cardSelect);

    mockCards.forEach((card) =>
      expect(screen.getByLabelText(card.key)).toBeInTheDocument(),
    );
  });

  it("shows a toast error when card types cannot be loaded", async () => {
    const user = userEvent.setup();

    vi.mocked(getCardTypes).mockRejectedValueOnce(new Error("Network Error"));

    render(<BalanceForm />);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));

    const cardSelect = screen.getByLabelText(/card/i);
    await user.click(cardSelect);

    expect(screen.getByLabelText(/visa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mastercard/i)).toBeInTheDocument();
  });

  it("submits a bank account", async () => {
    const user = userEvent.setup();

    vi.mocked(faker.finance.accountNumber).mockReturnValue("0123456789");
    vi.mocked(faker.location.streetAddress).mockReturnValue("Main Street");

    render(<BalanceForm />);

    const accountSelect = screen.getByLabelText(/account/i);
    await user.click(accountSelect);

    const dropdownSelect = screen.getByLabelText(/savings/i);
    await user.click(dropdownSelect);

    const bankField = screen.getByRole("textbox", { name: /service/i });
    await user.type(bankField, "City Bank");

    const balanceField = screen.getByRole("spinbutton", { name: /balance/i });
    await user.type(balanceField, "25000");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "Savings",
        total: 25000,
        service: "City Bank",
      }),
    );
  });

  it("submits a card account", async () => {
    const user = userEvent.setup();

    vi.mocked(generateCard).mockResolvedValueOnce({
      cards: [
        {
          number: "4111111111111111",
          address: "New York",
        },
      ],
    });

    render(<BalanceForm />);

    const balanceField = screen.getByLabelText(/balance/i);
    await user.type(balanceField, "20000");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    await waitFor(() =>
      expect(generateCard).toHaveBeenCalledWith("mastercard"),
    );

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "Credit Card",
        total: 20000,
      }),
    );
  });

  it("shows an error when card number is not generated", async () => {
    const user = userEvent.setup();

    vi.mocked(generateCard).mockRejectedValueOnce(new Error("Network Error"));

    render(<BalanceForm />);

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));

    expect(mutate).not.toHaveBeenCalled();
  });
});
