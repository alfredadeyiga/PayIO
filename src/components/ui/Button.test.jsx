import { render, screen } from "../../test/test-utils";
import Button from "./Button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  it("renders a link element when route is provided", () => {
    render(<Button route="/dashboard/overview" />);

    const linkElement = screen.getByRole("link");
    expect(linkElement).toBeInTheDocument();

    const buttonElement = screen.queryByRole("button");
    expect(buttonElement).not.toBeInTheDocument();
  });

  it("renders a button element when route is not provided", () => {
    render(<Button />);

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();

    const linkElement = screen.queryByRole("link");
    expect(linkElement).not.toBeInTheDocument();
  });

  it("renders its children", () => {
    render(
      <Button>
        <p>Save</p>
      </Button>,
    );

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls onClick on button click", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick} />);

    const buttonElement = screen.getByRole("button");
    await user.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button element", () => {
    render(<Button disabled />);

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeDisabled();
  });
});
