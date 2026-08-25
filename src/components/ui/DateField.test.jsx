import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "../../test/test-utils";
import DateField from "./DateField";
import { formatShortMonth, getToday } from "../../utils/formatDate";

describe("DateField", () => {
  it("renders label", () => {
    render(<DateField label="Date" />);

    const label = screen.getByText(/date/i);
    expect(label).toBeInTheDocument();
  });

  it("calls showPicker when button is clicked", async () => {
    const user = userEvent.setup();
    const showPicker = vi.fn();
    HTMLInputElement.prototype.showPicker = showPicker;

    render(<DateField id="date" label="Date" />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(showPicker).toHaveBeenCalledTimes(1);
  });

  it("requires input element", () => {
    render(<DateField id="date" label="Date" />);

    const inputElement = screen.getByLabelText(/date/i);
    expect(inputElement).toBeRequired();
  });

  it("does not require input element when required is false", () => {
    render(<DateField required={false} id="date" label="Date" />);

    const inputElement = screen.getByLabelText(/date/i);
    expect(inputElement).not.toBeRequired();
  });

  it("sets the minimum value for due dates", () => {
    render(<DateField id="due" label="Due" />);

    const inputElement = screen.getByLabelText(/due/i);
    expect(inputElement).toHaveAttribute("min", getToday());
    expect(inputElement).not.toHaveAttribute("max");
  });

  it("sets the maximum value when variant is last", () => {
    render(<DateField id="last" label="Last" variant="last" />);

    const inputElement = screen.getByLabelText(/last/i);
    expect(inputElement).toHaveAttribute("max", getToday());
    expect(inputElement).not.toHaveAttribute("min");
  });

  it("changes and displays input value onChange", () => {
    const value = "2026-08-30";

    render(<DateField id="date" label="Date" />);

    const inputElement = screen.getByLabelText(/date/i);
    fireEvent.change(inputElement, {
      target: { value },
    });

    expect(inputElement).toHaveValue(value);

    const dateLabel = screen.getByText(formatShortMonth(value));
    expect(dateLabel).toBeInTheDocument();
  });

  it("renders dateLabel when default value is passed", () => {
    const defaultValue = "2026-08-03";

    render(<DateField defaultValue={defaultValue} />);

    const dateLabel = screen.getByText(formatShortMonth(defaultValue));
    expect(dateLabel).toBeInTheDocument();
  });

  it("renders placeholder date when no default value is passed", () => {
    render(<DateField />);

    const placeholderDate = screen.getByText("14 May 2026");
    expect(placeholderDate).toBeInTheDocument();
  });
});
