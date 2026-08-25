import { render, screen } from "../../test/test-utils";
import { formatCurrencyRounded } from "../../utils/formatCurrency";
import SavingsCard from "./SavingsCard";

describe("SavingsCard", () => {
  it("renders a single item without date range", () => {
    const data = [{ date: "Aug 09", amount: 500 }];

    render(<SavingsCard data={data} />);

    const label = screen.getByText(data[0].date);
    expect(label).toBeInTheDocument();

    const amount = screen.getByText(
      `$${formatCurrencyRounded(data[0].amount)}`,
    );
    expect(amount).toBeInTheDocument();

    const range = screen.queryByText("Aug 09 - Aug 09");
    expect(range).not.toBeInTheDocument();
  });

  it("groups five items together", () => {
    const data = [
      { date: "Aug 01", amount: 100 },
      { date: "Aug 02", amount: 200 },
      { date: "Aug 03", amount: 300 },
      { date: "Aug 04", amount: 400 },
      { date: "Aug 05", amount: 500 },
    ];

    render(<SavingsCard data={data} />);

    const label = screen.getByText("Aug 01 - Aug 05");
    expect(label).toBeInTheDocument();

    const amount = screen.getByText(`$${formatCurrencyRounded(1500)}`);
    expect(amount).toBeInTheDocument();
  });

  it("combines a single group item with the previous group", () => {
    const data = [
      { date: "Aug 01", amount: 200 },
      { date: "Aug 02", amount: 200 },
      { date: "Aug 03", amount: 200 },
      { date: "Aug 04", amount: 200 },
      { date: "Aug 05", amount: 200 },
      { date: "Aug 06", amount: 200 },
    ];

    render(<SavingsCard data={data} />);

    const label = screen.getByText("Aug 01 - Aug 06");
    expect(label).toBeInTheDocument();

    const amount = screen.getByText(`$${formatCurrencyRounded(1200)}`);
    expect(amount).toBeInTheDocument();
  });

  it("creates multiple groups when there are more than five items", () => {
    const data = [
      { date: "Aug 01", amount: 100 },
      { date: "Aug 02", amount: 200 },
      { date: "Aug 03", amount: 300 },
      { date: "Aug 04", amount: 400 },
      { date: "Aug 05", amount: 500 },
      { date: "Aug 06", amount: 100 },
      { date: "Aug 07", amount: 200 },
      { date: "Aug 08", amount: 300 },
      { date: "Aug 09", amount: 400 },
    ];

    render(<SavingsCard data={data} />);

    expect(screen.getByText("Aug 01 - Aug 05")).toBeInTheDocument();
    expect(screen.getByText("Aug 06 - Aug 09")).toBeInTheDocument();
  });
});
