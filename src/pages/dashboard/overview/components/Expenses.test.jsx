import { render, screen } from "../../../../test/test-utils";
import Expenses from "./Expenses";
import userEvent from "@testing-library/user-event";
import { useTransactions } from "../../../../hooks/features/transactions/useTransactions";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { groupByCategory } from "../../../../utils/formatGroupData";
import { formatCapitalize } from "../../../../utils/formatCapitalize";

vi.mock("../../../../hooks/features/transactions/useTransactions");

vi.mock("../../../../utils/formatGroupData");

describe("Expenses", () => {
  const mockExpenses = [
    {
      id: "1",
      total: 500,
      category: "shopping",
    },
    {
      id: "2",
      total: 900,
      category: "housing",
    },
    {
      id: "3",
      total: 200,
      category: "transportation",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });

    vi.mocked(groupByCategory).mockReturnValue(mockExpenses);
  });

  it("renders expenses category and total", () => {
    render(<Expenses />);

    mockExpenses.forEach((expense) => {
      expect(
        screen.getByText(formatCapitalize(expense.category)),
      ).toBeInTheDocument();

      expect(
        screen.getByText(`$${formatCurrency(expense.total)}`),
      ).toBeInTheDocument();
    });
  });

  it("renders other categories with 0", () => {
    render(<Expenses />);

    expect(screen.getByText("Food")).toBeInTheDocument();

    expect(screen.getByText("Gaming")).toBeInTheDocument();

    expect(screen.getByText("Entertainment")).toBeInTheDocument();

    expect(screen.getAllByText("$0.00")).toHaveLength(3);
  });
});
