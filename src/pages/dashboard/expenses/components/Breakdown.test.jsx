import { render, screen } from "../../../../test/test-utils";
import Breakdown from "./Breakdown";
import { useTransactions } from "../../../../hooks/features/transactions/useTransactions";
import { formatCapitalize } from "../../../../utils/formatCapitalize";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { groupByCategory } from "../../../../utils/formatGroupData";

vi.mock("../../../../hooks/features/transactions/useTransactions");

vi.mock("../../../../utils/formatGroupData");

describe("Breakdown", () => {
  const mockExpenses = [
    {
      id: "1",
      category: "shopping",
      total: 350,
      percentChange: 50,
      change: "Increase",
      details: [
        { title: "T-Shirts", amount: 200, date: "2026-09-02" },
        { title: "Jeans", amount: 150, date: "2026-08-30" },
      ],
    },
    {
      id: "2",
      category: "food",
      total: 500,
      percentChange: 10,
      change: "Decrease",
      details: [
        { title: "Groceries", amount: 450, date: "2026-09-01" },
        { title: "Dinner", amount: 50, date: "2026-08-31" },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });

    vi.mocked(groupByCategory).mockReturnValue([]);
  });

  it("does not render anything when there are no expenses", () => {
    const { container } = render(<Breakdown />);

    expect(container).toBeEmptyDOMElement();

    expect(screen.queryByText(/expenses breakdown/i)).not.toBeInTheDocument();
  });

  it("renders default fields when there are expenses", () => {
    vi.mocked(groupByCategory).mockReturnValue(mockExpenses);

    render(<Breakdown />);

    expect(screen.getByText(/expenses breakdown/i)).toBeInTheDocument();

    mockExpenses.forEach((expense) => {
      expect(
        screen.getByText(formatCapitalize(expense.category)),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`$${formatCurrency(expense.total)}`),
      ).toBeInTheDocument();
      expect(screen.getByText(`${expense.percentChange}%`)).toBeInTheDocument();

      expense.details.forEach((detail) => {
        expect(screen.getByText(detail.title)).toBeInTheDocument();
        expect(screen.getByText(detail.date)).toBeInTheDocument();
        expect(
          screen.getByText(`$${formatCurrency(detail.amount)}`),
        ).toBeInTheDocument();
      });
    });
  });

  it("renders increase indicator when change is increase", () => {
    vi.mocked(groupByCategory).mockReturnValue([mockExpenses[0]]);

    render(<Breakdown />);

    expect(screen.getByLabelText(/increase in expenses/i)).toBeInTheDocument();
  });

  it("renders decrease indicator when change is decrease", () => {
    vi.mocked(groupByCategory).mockReturnValue([mockExpenses[1]]);

    render(<Breakdown />);

    expect(screen.getByLabelText(/decrease in expenses/i)).toBeInTheDocument();
  });

  it("does not render change indicator when there is no change", () => {
    vi.mocked(groupByCategory).mockReturnValue([
      {
        ...mockExpenses[0],
        change: null,
      },
    ]);

    render(<Breakdown />);

    expect(
      screen.queryByLabelText(/increase in expenses/i),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByLabelText(/decrease in expenses/i),
    ).not.toBeInTheDocument();
  });
});
