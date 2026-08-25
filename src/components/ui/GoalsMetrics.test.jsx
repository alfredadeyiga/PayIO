import { render, screen } from "../../test/test-utils";
import GoalsMetrics from "./GoalsMetrics";
import { formatCurrencyRounded } from "../../utils/formatCurrency";
import { formatCompact } from "../../utils/formatCompact";

describe("GoalsMetrics", () => {
  const mockGoal = { achieved: 5000, target: 7000 };

  it("renders goal metrics", () => {
    render(<GoalsMetrics goal={mockGoal} />);

    const achievedTitle = screen.getByText(/target achieved/i);
    expect(achievedTitle).toBeInTheDocument();

    const achievedAmount = screen.getByText(
      `$${formatCurrencyRounded(mockGoal.achieved)}`,
    );
    expect(achievedAmount).toBeInTheDocument();

    const targetTitle = screen.getByText(/month target/i);
    expect(targetTitle).toBeInTheDocument();

    const targetAmount = screen.getByText(
      `$${formatCurrencyRounded(mockGoal.target)}`,
    );
    expect(targetAmount).toBeInTheDocument();
  });

  it("renders formatted goal achieved and target", () => {
    render(<GoalsMetrics goal={mockGoal} />);

    const formatAchieved = screen.getByText(
      `$${formatCompact(mockGoal.achieved)}`,
    );
    expect(formatAchieved).toBeInTheDocument();

    const formatTarget = screen.getByText(`$${formatCompact(mockGoal.target)}`);
    expect(formatTarget).toBeInTheDocument();
  });
});
