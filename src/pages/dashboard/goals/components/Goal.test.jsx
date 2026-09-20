import { render, screen } from "../../../../test/test-utils";
import Goal from "./Goal";
import { useModal } from "../../../../context/ModalContext";
import userEvent from "@testing-library/user-event";
import {
  formatMonthRange,
  getCurrentPeriod,
} from "../../../../utils/formatDate";
import { useGoals } from "../../../../hooks/features/goals/useGoals";

vi.mock("../../../../context/ModalContext");

vi.mock("../../../../hooks/features/goals/useGoals");

vi.mock("../../../../components/ui/GoalsMetrics", () => ({
  default: () => <div>Goals Metrics</div>,
}));

const openModal = vi.fn();

describe("Goal", () => {
  const currentPeriod = getCurrentPeriod();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    vi.mocked(useGoals).mockReturnValue({
      data: [
        {
          id: "1",
          period: currentPeriod,
        },
      ],
    });
  });

  it("renders empty state when there is no data", () => {
    vi.mocked(useGoals).mockReturnValue({
      data: [],
    });

    render(<Goal />);

    expect(screen.getByText(/add your monthly goal/i)).toBeInTheDocument();
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    vi.mocked(useGoals).mockReturnValue({
      data: [],
    });

    render(<Goal />);

    const emptyState = screen.getByRole("button", {
      name: /add your monthly goal/i,
    });
    await user.click(emptyState);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders default fields when there is data", () => {
    render(<Goal />);

    expect(screen.getByText(/savings goal/i)).toBeInTheDocument();

    expect(
      screen.getByText(formatMonthRange(currentPeriod)),
    ).toBeInTheDocument();

    expect(screen.getByText("Goals Metrics")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /adjust goal/i }),
    ).toBeInTheDocument();

    expect(screen.queryByTestId(/dropdown/i)).not.toBeInTheDocument();
  });

  it("calls openModal on adjust button click", async () => {
    const user = userEvent.setup();

    render(<Goal />);

    const adjustButton = screen.getByRole("button", { name: /adjust goal/i });
    await user.click(adjustButton);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders dropdown on dropdown toggle", async () => {
    const user = userEvent.setup();

    render(<Goal />);

    const dropdownToggle = screen.getByLabelText(/toggle goal dropdown/i);
    await user.click(dropdownToggle);

    expect(screen.getByTestId(/dropdown/i)).toBeInTheDocument();
  });

  it("changes selected option and hides adjust button on current period change", async () => {
    const user = userEvent.setup();

    const period = "August 2026";

    vi.mocked(useGoals).mockReturnValue({
      data: [{ id: "1", period }],
    });

    render(<Goal />);

    const dropdownToggle = screen.getByLabelText(/toggle goal dropdown/i);
    await user.click(dropdownToggle);

    const periodButton = screen.getByRole("button", { name: period });
    await user.click(periodButton);

    expect(screen.getByText(formatMonthRange(period))).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /adjust goal/i }),
    ).not.toBeInTheDocument();
  });

  it("hides dropdown on dropdown click", async () => {
    const user = userEvent.setup();

    render(<Goal />);

    const dropdownToggle = screen.getByLabelText(/toggle goal dropdown/i);
    await user.click(dropdownToggle);

    const dropdown = screen.getByTestId(/dropdown/i);
    await user.click(dropdown);

    expect(screen.queryByTestId(/dropdown/i)).not.toBeInTheDocument();
  });
});
