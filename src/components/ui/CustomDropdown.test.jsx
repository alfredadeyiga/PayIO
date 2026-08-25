import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import CustomDropdown from "./CustomDropdown";

describe("CustomDropdown", () => {
  const mockOptions = [
    { value: "food", label: "Food" },
    { value: "housing", label: "Housing" },
  ];

  it("calls onClick on dropdown element click", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<CustomDropdown onClick={handleClick} />);

    const element = screen.getByTestId(/dropdown/i);
    expect(element).toBeInTheDocument();
    await user.click(element);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders all options", () => {
    render(<CustomDropdown options={mockOptions} />);

    mockOptions.forEach((option) =>
      expect(
        screen.getByRole("button", { name: option.value }),
      ).toBeInTheDocument(),
    );
  });

  it("calls setSelected on option button click", async () => {
    const user = userEvent.setup();
    const handleSetSelected = vi.fn();

    render(
      <CustomDropdown options={mockOptions} setSelected={handleSetSelected} />,
    );

    const optionButton = screen.getByRole("button", { name: /food/i });
    await user.click(optionButton);

    expect(handleSetSelected).toHaveBeenCalledWith(mockOptions[0]);
  });
});
