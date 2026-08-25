import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import InputField from "./InputField";

describe("InputField", () => {
  it("renders label", () => {
    render(<InputField label="Amount" />);

    const label = screen.getByText(/amount/i);
    expect(label).toBeInTheDocument();
  });

  it("renders input element with type", () => {
    render(<InputField type="number" />);

    const inputElement = screen.getByRole("spinbutton");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "number");
  });

  it("requires input element", () => {
    render(<InputField id="amount" label="Amount" />);

    const inputElement = screen.getByLabelText(/amount/i);
    expect(inputElement).toBeRequired();
  });

  it("does not require input element when required is false", () => {
    render(<InputField required={false} id="amount" label="Amount" />);

    const inputElement = screen.getByLabelText(/amount/i);
    expect(inputElement).not.toBeRequired();
  });

  it("sets the minimum value and step for number inputs", () => {
    render(<InputField id="amount" label="Amount" type="number" min={1} />);

    const inputElement = screen.getByLabelText(/amount/i);
    expect(inputElement).toHaveAttribute("min", "1");
    expect(inputElement).toHaveAttribute("step", "0.01");
  });

  it("does not set the minimum value and step for other input types", () => {
    render(<InputField id="amount" label="Amount" />);

    const inputElement = screen.getByLabelText(/amount/i);
    expect(inputElement).not.toHaveAttribute("min");
    expect(inputElement).not.toHaveAttribute("step");
  });

  it("renders input placeholder", () => {
    render(<InputField placeholder="Enter amount" />);

    const inputElement = screen.getByPlaceholderText(/enter amount/i);
    expect(inputElement).toBeInTheDocument();
  });

  it("hides edit button by default", () => {
    render(<InputField />);

    const editButton = screen.queryByRole("button");
    expect(editButton).not.toBeInTheDocument();
  });

  it("renders edit button when variant is settings", () => {
    render(<InputField variant="settings" />);

    const editButton = screen.getByRole("button");
    expect(editButton).toBeInTheDocument();
  });

  it("handles input focus on edit button click", async () => {
    const user = userEvent.setup();

    render(<InputField variant="settings" />);

    const editButton = screen.getByRole("button");
    await user.click(editButton);

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveFocus();
  });

  it("renders error text", () => {
    render(<InputField error="Try again" />);

    const errorText = screen.getByText(/try again/i);
    expect(errorText).toBeInTheDocument();
  });
});
