import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import ActionField from "./ActionField";

describe("ActionField", () => {
  it("shows dropdown on menu button click", async () => {
    const user = userEvent.setup();

    render(<ActionField />);

    const menuButton = screen.getByLabelText(/menu/i);
    expect(menuButton).toBeInTheDocument();
    await user.click(menuButton);

    const dropdown = screen.getByTestId(/action/i);
    expect(dropdown).toBeInTheDocument();
  });

  it("hides dropdown on double click", async () => {
    const user = userEvent.setup();

    render(<ActionField />);

    const menuButton = screen.getByLabelText(/menu/i);
    await user.dblClick(menuButton);

    const dropdown = screen.queryByTestId(/action/i);
    expect(dropdown).not.toBeInTheDocument();
  });

  it("calls onEdit on edit button click", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();

    render(<ActionField onEdit={handleEdit} />);

    const menuButton = screen.getByLabelText(/menu/i);
    await user.click(menuButton);

    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();
    await user.click(editButton);

    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete on delete button click", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    render(<ActionField onDelete={handleDelete} />);

    const menuButton = screen.getByLabelText(/menu/i);
    await user.click(menuButton);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
