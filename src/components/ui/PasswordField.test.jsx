import { render, screen } from "../../test/test-utils";
import PasswordField from "./PasswordField";
import userEvent from "@testing-library/user-event";

describe("PasswordField", () => {
  it("renders label", () => {
    render(<PasswordField label="Password" />);

    const label = screen.getByText(/password/i);
    expect(label).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <PasswordField label="Password">
        <a href="/forgot">Forgot password?</a>
      </PasswordField>,
    );

    const children = screen.getByRole("link", { name: /forgot password/i });
    expect(children).toBeInTheDocument();
  });

  it("sets input element type to password", () => {
    render(<PasswordField label="Password" />);

    const inputElement = screen.getByLabelText(/password/i);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "password");
  });

  it("sets input element type to text on toggle button click", async () => {
    const user = userEvent.setup();

    render(<PasswordField label="Password" />);

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
    await user.click(toggleButton);

    const inputElement = screen.getByLabelText(/password/i);
    expect(inputElement).toHaveAttribute("type", "text");
    expect(inputElement).toHaveFocus();
  });

  it("hides placeholder text", () => {
    render(<PasswordField />);

    const placeholderText = screen.getByPlaceholderText("•••••••••••");
    expect(placeholderText).toBeInTheDocument();
  });

  it("shows placeholder text on toggle button click", async () => {
    const user = userEvent.setup();

    render(<PasswordField />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);

    const placeholderText = screen.getByPlaceholderText("152@@##PAss");
    expect(placeholderText).toBeInTheDocument();
  });

  it("renders error text", () => {
    render(<PasswordField error="Wrong password" />);

    const errorText = screen.getByText(/wrong password/i);
    expect(errorText).toBeInTheDocument();
  });
});
