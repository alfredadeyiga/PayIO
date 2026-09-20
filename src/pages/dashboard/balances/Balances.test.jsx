import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test/test-utils";
import Balances from "./Balances";
import { useModal } from "../../../context/ModalContext";
import { useBalances } from "../../../hooks/features/balances/useBalances";
import { useDeleteBalance } from "../../../hooks/features/balances/useDeleteBalance";
import { formatAccountNumber } from "../../../utils/formatAccountNumber";

vi.mock("../../../context/ModalContext");

vi.mock("../../../hooks/features/balances/useBalances");

vi.mock("../../../hooks/features/balances/useDeleteBalance");

const deleteBalance = vi.fn();

describe("Balances", () => {
  const mockBalances = [
    {
      id: "1",
      service: "Visa",
      type: "Debit Card",
      total: 5000,
      branch_name: "Test Branch",
      account_number: "4111222233334444",
      icon: "/visa.png",
    },
    {
      id: "2",
      service: "City Bank",
      type: "Savings",
      total: 3500,
      branch_name: "City Branch",
      account_number: "0123456789",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal: vi.fn(),
    });

    vi.mocked(useBalances).mockReturnValue({
      data: mockBalances,
    });

    vi.mocked(useDeleteBalance).mockReturnValue({
      mutate: deleteBalance,
    });
  });

  it("renders balance default fields", () => {
    render(<Balances />);

    mockBalances.forEach((balance) => {
      const isCard = balance.type.includes("Card");
      const serviceType = isCard ? "Card" : "Account";

      expect(screen.getByText(`${serviceType} Number`)).toBeInTheDocument();

      expect(screen.getByText(balance.service)).toBeInTheDocument();
      expect(screen.getByText(balance.type)).toBeInTheDocument();
      expect(screen.getByText(`$${balance.total}`)).toBeInTheDocument();

      expect(
        screen.getByText(
          formatAccountNumber(balance.account_number, {
            type: balance.type,
          }),
        ),
      ).toBeInTheDocument();

      if (isCard) {
        expect(screen.getByAltText(/icon/i)).toHaveAttribute(
          "src",
          balance.icon,
        );
      }
    });
  });

  it("hides balance icon and card number when type is not card", () => {
    vi.mocked(useBalances).mockReturnValue({
      data: [mockBalances[1]],
    });

    render(<Balances />);

    const cardNumber = screen.queryByText(/card number/i);
    expect(cardNumber).not.toBeInTheDocument();

    const balanceIcon = screen.queryByAltText(/icon/i);
    expect(balanceIcon).not.toBeInTheDocument();
  });

  it("unmasks card number on card number toggle", async () => {
    const user = userEvent.setup();

    render(<Balances />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle card number/i,
    });
    expect(toggleButton).toBeInTheDocument();
    await user.click(toggleButton);

    const unmaskedNumber = screen.getByText(
      formatAccountNumber(mockBalances[0].account_number, {
        type: mockBalances[0].type,
        masked: false,
      }),
    );
    expect(unmaskedNumber).toBeInTheDocument();
  });

  it("masks account number after toggling twice", async () => {
    const user = userEvent.setup();

    render(<Balances />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle account number/i,
    });
    await user.dblClick(toggleButton);

    const maskedNumber = screen.getByText(
      formatAccountNumber(mockBalances[1].account_number, {
        type: mockBalances[1].type,
      }),
    );
    expect(maskedNumber).toBeInTheDocument();
  });

  it("calls open modal and deletes balance on remove button click", async () => {
    const user = userEvent.setup();

    const openModal = vi.fn();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    openModal.mockImplementation((options) => {
      options.onConfirm();
    });

    render(<Balances />);

    const removeButton = screen.getByRole("button", {
      name: /remove card number/i,
    });
    expect(removeButton).toBeInTheDocument();
    await user.click(removeButton);

    expect(openModal).toHaveBeenCalledWith(
      expect.objectContaining({
        onConfirm: expect.any(Function),
      }),
    );

    expect(deleteBalance).toHaveBeenCalledWith("1");
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    const openModal = vi.fn();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    render(<Balances />);

    const addBalance = screen.getByRole("button", { name: /add new balance/i });
    expect(addBalance).toBeInTheDocument();
    await user.click(addBalance);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });
});
