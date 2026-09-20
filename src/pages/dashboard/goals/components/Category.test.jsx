import { render, screen } from "../../../../test/test-utils";
import Category from "./Category";
import { useModal } from "../../../../context/ModalContext";
import { useGoals } from "../../../../hooks/features/goals/useGoals";
import { useSaveGoals } from "../../../../hooks/features/goals/useSaveGoals";
import { formatCapitalize } from "../../../../utils/formatCapitalize";
import { formatCurrency } from "../../../../utils/formatCurrency";
import userEvent from "@testing-library/user-event";
import { getCurrentPeriod } from "../../../../utils/formatDate";

vi.mock("../../../../context/ModalContext");

vi.mock("../../../../hooks/features/goals/useGoals");

vi.mock("../../../../hooks/features/goals/useSaveGoals");

const openModal = vi.fn();

const mutate = vi.fn();

describe("Category", () => {
  const currentPeriod = getCurrentPeriod();

  const mockGoals = [
    {
      id: "1",
      period: currentPeriod,
      expense_goals: [
        {
          target: 450,
          category: "food",
        },
        {
          target: 100,
          category: "transportation",
        },
        {
          target: 50,
          category: "entertainment",
        },
      ],
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

    vi.mocked(useSaveGoals).mockReturnValue({
      mutate,
    });
  });

  it("renders expense goals fields with the other category fields", () => {
    const expenseGoals = mockGoals[0].expense_goals;

    render(<Category />);

    expenseGoals.forEach((goal) => {
      expect(
        screen.getByText(formatCapitalize(goal.category)),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`$${formatCurrency(goal.target)}`),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: `Adjust ${goal.category}` }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Housing")).toBeInTheDocument();

    expect(screen.getByText("Others")).toBeInTheDocument();

    expect(screen.getByText("Shopping")).toBeInTheDocument();

    expect(screen.getByText("Gaming")).toBeInTheDocument();

    expect(screen.getAllByText("$0.00")).toHaveLength(4);
  });

  it("calls openModal on adjust button click", async () => {
    const user = userEvent.setup();

    render(<Category />);

    const adjustButton = screen.getByRole("button", { name: /adjust food/i });
    await user.click(adjustButton);

    expect(openModal).toHaveBeenCalledWith({ content: expect.anything() });
  });
});
