import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import UpdateForm from "./UpdateForm";
import { useModal } from "../../context/ModalContext";

vi.mock("../../context/ModalContext");

describe("UpdateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      isLoading: false,
    });
  });

  it("renders input field", () => {
    render(<UpdateForm />);

    const inputField = screen.getByRole("spinbutton");
    expect(inputField).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(<UpdateForm id="amount" label="Amount" />);

    const labelText = screen.getByLabelText(/amount/i);
    expect(labelText).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    render(<UpdateForm placeholder="$500" />);

    const placeholderText = screen.getByPlaceholderText("$500");
    expect(placeholderText).toBeInTheDocument();
  });

  it("calls onSubmit on form button click", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<UpdateForm onSubmit={onSubmit} />);

    const inputField = screen.getByRole("spinbutton");
    await user.type(inputField, "500");

    const formButton = screen.getByRole("button", { name: /save/i });
    await user.click(formButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
