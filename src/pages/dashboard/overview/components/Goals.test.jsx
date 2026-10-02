import { render, screen } from "../../../../test/test-utils";
import Goals from "./Goals";
import { useModal } from "../../../../context/ModalContext";
import userEvent from "@testing-library/user-event";
import { getCurrentPeriod } from "../../../../utils/formatDate";
import { useGoals } from "../../../../hooks/features/goals/useGoals";
import { formatCurrencyRounded } from "../../../../utils/formatCurrency";

vi.mock("../../../../context/ModalContext");

vi.mock("../../../../hooks/features/goals/useGoals");

vi.mock("../../../../components/ui/GoalsMetrics", () => ({
  default: () => <div>Goals Metrics</div>,
}));

const openModal = vi.fn();

describe("Goals", () => {
  const currentPeriod = getCurrentPeriod();

  const mockGoals = [
    {
      id: "1",
      period: currentPeriod,
      target: 7000,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    vi.mocked(useGoals).mockReturnValue({
      data: mockGoals,
    });
  });

  it("renders empty state when there is no data", () => {
    vi.mocked(useGoals).mockReturnValue({
      data: [],
    });

    render(<Goals />);

    expect(screen.getByText(/add your monthly goal/i)).toBeInTheDocument();
  });

  it("calls open modal on empty state action click", async () => {
    const user = userEvent.setup();

    vi.mocked(useGoals).mockReturnValue({
      data: [],
    });

    render(<Goals />);

    const emptyState = screen.getByRole("button", {
      name: /add your monthly goal/i,
    });
    await user.click(emptyState);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });

  it("renders default fields when there is data", () => {
    render(<Goals />);

    expect(
      screen.getByText(`$${formatCurrencyRounded(mockGoals[0].target)}`),
    ).toBeInTheDocument();

    expect(
      screen.getByText(currentPeriod.replace(" ", ", ")),
    ).toBeInTheDocument();

    expect(screen.getByText("Goals Metrics")).toBeInTheDocument();
  });

  it("renders 0 when there is no goal for the current period", () => {
    vi.mocked(useGoals).mockReturnValue({
      data: [
        {
          id: "1",
          period: "August 2026",
          target: 10000,
        },
      ],
    });

    render(<Goals />);

    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
