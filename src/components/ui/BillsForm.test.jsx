import { toast } from "react-toastify";
import { useModal } from "../../context/ModalContext";
import { useAddBills } from "../../hooks/features/bills/useAddBills";
import { useBills } from "../../hooks/features/bills/useBills";
import { useUpdateBills } from "../../hooks/features/bills/useUpdateBills";
import { fireEvent, render, screen } from "../../test/test-utils";
import BillsForm from "./BillsForm";
import userEvent from "@testing-library/user-event";
import { getToday } from "../../utils/formatDate";

vi.mock("../../hooks/features/bills/useAddBills");

vi.mock("../../hooks/features/bills/useUpdateBills");

vi.mock("../../hooks/features/bills/useBills");

vi.mock("../../context/ModalContext");

vi.mock("react-toastify", () => ({
  toast: { info: vi.fn() },
}));

const addBill = vi.fn();
const updateBill = vi.fn();

describe("BillsForm", () => {
  const mockBills = [
    {
      id: "1",
      bill_name: "Netflix",
      description: "Entertainment",
      amount: 15.99,
      due_date: "2025-09-15",
      last_charge: "2025-08-15",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAddBills).mockReturnValue({
      mutate: addBill,
    });

    vi.mocked(useUpdateBills).mockReturnValue({
      mutate: updateBill,
    });

    vi.mocked(useModal).mockReturnValue({
      isLoading: false,
    });

    vi.mocked(useBills).mockReturnValue({
      data: [],
    });
  });

  it("renders the default fields", () => {
    render(<BillsForm />);

    const titleField = screen.getByLabelText(/bill name/i);
    expect(titleField).toBeInTheDocument();

    const dueDate = screen.getByLabelText(/due date/i);
    expect(dueDate).toBeInTheDocument();

    const amountField = screen.getByLabelText(/amount/i);
    expect(amountField).toBeInTheDocument();

    const descField = screen.getByLabelText(/description/i);
    expect(descField).toBeInTheDocument();

    const lastCharge = screen.getByLabelText(/last charge/i);
    expect(lastCharge).toBeInTheDocument();
  });

  it("renders placeholders with current bill when updating bill", () => {
    vi.mocked(useBills).mockReturnValue({
      data: mockBills,
    });

    render(<BillsForm currentId="1" />);

    const titlePlaceholder = screen.getByPlaceholderText(/netflix/i);
    expect(titlePlaceholder).toBeInTheDocument();

    const amountPlaceholder = screen.getByPlaceholderText(/\$15.99/i);
    expect(amountPlaceholder).toBeInTheDocument();

    const descPlaceholder = screen.getByPlaceholderText(/entertainment/i);
    expect(descPlaceholder).toBeInTheDocument();
  });

  it("requires all fields when there is no currentId", () => {
    render(<BillsForm />);

    const titleField = screen.getByLabelText(/bill name/i);
    expect(titleField).toBeRequired();

    const dueDate = screen.getByLabelText(/due date/i);
    expect(dueDate).toBeRequired();

    const amountField = screen.getByLabelText(/amount/i);
    expect(amountField).toBeRequired();

    const descField = screen.getByLabelText(/description/i);
    expect(descField).toBeRequired();

    const lastCharge = screen.getByLabelText(/last charge/i);
    expect(lastCharge).toBeRequired();
  });

  it("adds a new bill", async () => {
    const user = userEvent.setup();

    render(<BillsForm />);

    const titleField = screen.getByRole("textbox", { name: /bill name/i });
    await user.type(titleField, "Spotify");

    const dueDate = screen.getByLabelText(/due date/i);
    fireEvent.change(dueDate, {
      target: { value: getToday() },
    });

    const amountField = screen.getByRole("spinbutton", { name: /amount/i });
    await user.type(amountField, "13.99");

    const descField = screen.getByRole("textbox", { name: /description/i });
    await user.type(descField, "Entertainment");

    const lastCharge = screen.getByLabelText(/last charge/i);
    fireEvent.change(lastCharge, {
      target: { value: "2026-07-18" },
    });

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(addBill).toHaveBeenCalledTimes(1);
  });

  it("updates only changed values in current bill with currentId", async () => {
    vi.mocked(useBills).mockReturnValue({
      data: mockBills,
    });

    const user = userEvent.setup();

    render(<BillsForm currentId="1" />);

    const titleField = screen.getByRole("textbox", { name: /bill name/i });
    await user.type(titleField, "Spotify");

    const amountField = screen.getByRole("spinbutton", { name: /amount/i });
    await user.type(amountField, "15.99");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(updateBill).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        updates: { bill_name: "Spotify" },
      }),
    );
  });

  it("shows a toast info when no changes to the current bill", async () => {
    vi.mocked(useBills).mockReturnValue({
      data: mockBills,
    });

    const user = userEvent.setup();

    render(<BillsForm currentId="1" />);

    const titleField = screen.getByRole("textbox", { name: /bill name/i });
    await user.type(titleField, "Netflix");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(toast.info).toHaveBeenCalledTimes(1);

    expect(updateBill).not.toHaveBeenCalled();
  });
});
