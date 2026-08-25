import { render, screen } from "../../test/test-utils";
import TableCard from "./TableCard";

describe("TableCard", () => {
  it("renders data with column labels and rows", () => {
    const data = [
      {
        id: "1",
        transaction_type: "revenue",
        date: "19 May 2026",
      },
      {
        id: "2",
        transaction_type: "expenses",
        date: "19 May 2026",
      },
    ];

    const columns = [
      { label: "Date", accessor: "date" },
      { label: "Transaction Type", accessor: "transaction_type" },
    ];

    const rows = vi.fn((item, column) => <p>{item[column.accessor]}</p>);

    render(<TableCard data={data} columns={columns} rows={rows} />);

    columns.forEach((column) =>
      expect(screen.getAllByText(column.label)).toHaveLength(2),
    );

    expect(rows).toHaveBeenCalledTimes(4);

    expect(screen.getAllByText("19 May 2026")).toHaveLength(2);

    expect(screen.getByText("revenue")).toBeInTheDocument();

    expect(screen.getByText("expenses")).toBeInTheDocument();
  });
});
