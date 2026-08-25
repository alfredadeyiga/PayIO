import { render, screen } from "../../test/test-utils";
import Table from "./Table";

describe("Table", () => {
  it("renders column labels", () => {
    const columns = [
      { label: "ID" },
      { label: "Date" },
      { label: "Transaction Type" },
    ];

    render(<Table columns={columns} />);

    columns.forEach((column) =>
      expect(
        screen.getByRole("columnheader", { name: column.label }),
      ).toBeInTheDocument(),
    );
  });

  it("renders rows with data", () => {
    const data = [
      {
        id: "1",
        transaction_type: "revenue",
        date: "17 May 2026",
      },
      {
        id: "2",
        transaction_type: "expenses",
        date: "17 May 2026",
      },
    ];

    const rows = vi.fn((item) => (
      <tr key={item.id}>
        <td>{item.transaction_type}</td>
        <td>{item.date}</td>
      </tr>
    ));

    render(<Table data={data} rows={rows} />);

    expect(screen.getByRole("cell", { name: "revenue" })).toBeInTheDocument();

    expect(screen.getByRole("cell", { name: "expenses" })).toBeInTheDocument();

    const dates = screen.getAllByRole("cell", { name: "17 May 2026" });
    expect(dates).toHaveLength(2);

    expect(rows).toHaveBeenCalledTimes(2);
  });
});
