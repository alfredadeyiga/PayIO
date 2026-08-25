import { render, screen } from "../../test/test-utils";
import TableRow from "./TableRow";

describe("TableRow", () => {
  it("renders its children", () => {
    render(
      <TableRow>
        <p>Content</p>
      </TableRow>,
    );

    const children = screen.getByRole("row", { name: "Content" });
    expect(children).toBeInTheDocument();
  });
});
