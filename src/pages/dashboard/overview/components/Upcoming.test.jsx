import { render, screen } from "../../../../test/test-utils";
import Upcoming from "./Upcoming";
import { useModal } from "../../../../context/ModalContext";
import userEvent from "@testing-library/user-event";
import {
  formatDay,
  formatMonth,
  formatShortMonth,
} from "../../../../utils/formatDate";
import { useBills } from "../../../../hooks/features/bills/useBills";
import { formatCompact } from "../../../../utils/formatCompact";

vi.mock("../../../../context/ModalContext");

vi.mock("../../../../hooks/features/bills/useBills");

const openModal = vi.fn();

describe("Upcoming", () => {
  const mockBills = [
    {
      id: "1",
      bill_name: "Netflix",
      description: "Entertainment",
      amount: 15.99,
      due_date: "2025-09-17",
      last_charge: "2025-08-17",
      logo: "/netflix.png",
    },
    {
      id: "2",
      bill_name: "Apple",
      description: "iCloud bill",
      amount: 3.99,
      due_date: "2026-09-31",
      last_charge: "2026-08-31",
      logo: "/apple.png",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    vi.mocked(useBills).mockReturnValue({
      data: mockBills,
    });
  });

  it("renders empty state when there is no data", () => {
    vi.mocked(useBills).mockReturnValue({
      data: [],
    });

    render(<Upcoming />);

    expect(screen.getByText(/add upcoming bills/i)).toBeInTheDocument();
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    vi.mocked(useBills).mockReturnValue({
      data: [],
    });

    render(<Upcoming />);

    const emptyState = screen.getByRole("button", {
      name: /add upcoming bills/i,
    });
    await user.click(emptyState);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders default fields when there is data", () => {
    render(<Upcoming />);

    mockBills.forEach((bill) => {
      expect(screen.getByText(formatMonth(bill.due_date))).toBeInTheDocument();

      expect(screen.getByText(formatDay(bill.due_date))).toBeInTheDocument();

      expect(screen.getByText(bill.bill_name)).toBeInTheDocument();

      expect(screen.getByAltText(`${bill.bill_name}-logo`)).toHaveAttribute(
        "src",
        bill.logo,
      );

      expect(
        screen.getByText(`Last Charge - ${formatShortMonth(bill.last_charge)}`),
      ).toBeInTheDocument();

      expect(
        screen.getByText(`$${formatCompact(bill.amount)}`),
      ).toBeInTheDocument();
    });
  });
});
