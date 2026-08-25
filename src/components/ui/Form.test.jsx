import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import Form from "./Form";
import { useModal } from "../../context/ModalContext";

vi.mock("../../context/ModalContext");

describe("Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      isLoading: false,
    });
  });

  it("renders children without a submit button", () => {
    render(
      <Form>
        <p>Content</p>
      </Form>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();

    const button = screen.queryByRole("button", { name: /save/i });
    expect(button).not.toBeInTheDocument();
  });

  it("renders children with submit button when variant is dashboard", () => {
    render(
      <Form variant="dashboard">
        <p>Content</p>
      </Form>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /save/i });
    expect(button).toBeInTheDocument();
  });

  it("calls onSubmit on submit button click", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<Form onSubmit={handleSubmit} variant="dashboard" />);

    const button = screen.getByRole("button", { name: /save/i });
    await user.click(button);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables submit button when isLoading is true", () => {
    vi.mocked(useModal).mockReturnValue({
      isLoading: true,
    });

    render(<Form variant="dashboard" />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders save text on submit button on mount", () => {
    render(<Form variant="dashboard" />);

    const saveText = screen.getByText(/save/i);
    expect(saveText).toBeInTheDocument();

    const loader = screen.queryByRole("status");
    expect(loader).not.toBeInTheDocument();
  });

  it("renders loader on submit button when isLoading is true", () => {
    vi.mocked(useModal).mockReturnValue({
      isLoading: true,
    });

    render(<Form variant="dashboard" />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();

    const saveText = screen.queryByText(/save/i);
    expect(saveText).not.toBeInTheDocument();
  });
});
