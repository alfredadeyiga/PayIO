import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test/test-utils";
import Bills from "./Bills";
import { useModal } from "../../../context/ModalContext";
import { useBills } from "../../../hooks/features/bills/useBills";
import { useDeleteBills } from "../../../hooks/features/bills/useDeleteBills";
import {
  formatDay,
  formatMonth,
  formatShortMonth,
} from "../../../utils/formatDate";
import { formatCompact } from "../../../utils/formatCompact";

vi.mock("../../../context/ModalContext");

vi.mock("../../../hooks/features/bills/useBills");

vi.mock("../../../hooks/features/bills/useDeleteBills");

const deleteBill = vi.fn();

describe("Bills", () => {
  const mockBills = [
    {
      id: "1",
      due_date: "2026-08-31",
      bill_name: "Apple",
      amount: 3.99,
      description: "iCloud bill",
      last_charge: "2026-07-31",
      logo: "/apple.png",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal: vi.fn(),
    });

    vi.mocked(useBills).mockReturnValue({
      data: mockBills,
    });

    vi.mocked(useDeleteBills).mockReturnValue({
      mutate: deleteBill,
    });
  });

  it("renders empty state when there are no bills", () => {
    vi.mocked(useBills).mockReturnValue({
      data: [],
    });

    render(<Bills />);

    expect(screen.getByText(/add upcoming bills/i)).toBeInTheDocument();
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    const openModal = vi.fn();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    vi.mocked(useBills).mockReturnValue({
      data: [],
    });

    render(<Bills />);

    const emptyState = screen.getByRole("button", {
      name: /add upcoming bills/i,
    });
    await user.click(emptyState);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders bills tables when there are bills", () => {
    render(<Bills />);

    expect(
      screen.getByText(formatMonth(mockBills[0].due_date)),
    ).toBeInTheDocument();

    expect(
      screen.getByText(formatDay(mockBills[0].due_date)),
    ).toBeInTheDocument();

    expect(screen.getAllByText(mockBills[0].bill_name)).toHaveLength(2);

    expect(screen.getByText(mockBills[0].description)).toBeInTheDocument();

    expect(screen.getAllByAltText(/logo/i)).toHaveLength(2);

    expect(
      screen.getByText(formatShortMonth(mockBills[0].due_date)),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(formatShortMonth(mockBills[0].last_charge)),
    ).toHaveLength(2);

    expect(
      screen.getAllByText(`$${formatCompact(mockBills[0].amount)}`),
    ).toHaveLength(2);
  });

  it("calls open modal and add new bill on new bill button click", async () => {
    const user = userEvent.setup();

    const openModal = vi.fn();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    render(<Bills />);

    const addBill = screen.getByRole("button", {
      name: /add new bill/i,
    });
    expect(addBill).toBeInTheDocument();
    await user.click(addBill);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });
});
