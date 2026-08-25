import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("calls action on button click", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(<EmptyState action={handleAction} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    await user.click(button);

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("renders description", () => {
    render(<EmptyState description="Add transaction" />);

    const description = screen.getByText(/add transaction/i);
    expect(description).toBeInTheDocument();
  });
});
