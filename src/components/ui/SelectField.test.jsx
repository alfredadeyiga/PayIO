import { render, screen } from "../../test/test-utils";
import SelectField from "./SelectField";
import userEvent from "@testing-library/user-event";

describe("SelectField", () => {
  const mockOptions = [
    { value: "revenue", label: "Revenue" },
    { value: "expenses", label: "Expenses" },
  ];

  it("renders label", () => {
    render(<SelectField label="Transaction Type" />);

    const label = screen.getByRole("heading", { name: /transaction type/i });
    expect(label).toBeInTheDocument();
  });

  it("renders selected label", () => {
    render(
      <SelectField
        label="Transaction Type"
        options={mockOptions}
        selectedOption="revenue"
      />,
    );

    const selectedLabel = screen.getByText("Revenue");
    expect(selectedLabel).toBeInTheDocument();
  });

  it("hides dropdown by default", () => {
    render(<SelectField label="Transaction Type" />);

    const dropdown = screen.queryByTestId(/dropdown/i);
    expect(dropdown).not.toBeInTheDocument();
  });

  it("renders dropdown and options on button click", async () => {
    const user = userEvent.setup();

    render(<SelectField label="Transaction Type" options={mockOptions} />);

    const button = screen.getByRole("button", { name: /transaction type/i });
    expect(button).toBeInTheDocument();
    await user.click(button);

    const dropdown = screen.getByTestId(/dropdown/i);
    expect(dropdown).toBeInTheDocument();

    mockOptions.forEach((option) =>
      expect(screen.getByText(option.label)).toBeInTheDocument(),
    );
  });

  it("hides dropdown and sets selected option on option button click", async () => {
    const user = userEvent.setup();
    const setSelectedOption = vi.fn();

    render(
      <SelectField
        label="Transaction Type"
        options={mockOptions}
        setSelectedOption={setSelectedOption}
      />,
    );

    const button = screen.getByRole("button", { name: /transaction type/i });
    await user.click(button);

    const expensesOption = screen.getByRole("button", { name: /expenses/i });
    await user.click(expensesOption);

    expect(setSelectedOption).toHaveBeenCalledWith("expenses");

    const dropdown = screen.queryByTestId(/dropdown/i);
    expect(dropdown).not.toBeInTheDocument();

    mockOptions.forEach((option) =>
      expect(screen.queryByText(option.label)).not.toBeInTheDocument(),
    );
  });
});
