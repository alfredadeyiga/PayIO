import { fireEvent, render, screen } from "../../test/test-utils";
import Modal from "./Modal";
import { useModal } from "../../context/ModalContext";
import userEvent from "@testing-library/user-event";

vi.mock("../../context/ModalContext");

const closeModal = vi.fn();
const onConfirm = vi.fn();

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      closeModal,
      onConfirm,
    });
  });

  it("renders loader when modal is loading and type is confirm", () => {
    vi.mocked(useModal).mockReturnValue({
      type: "confirm",
      isLoading: true,
    });

    render(<Modal />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();

    const modal = screen.queryByTestId(/modal/i);
    expect(modal).not.toBeInTheDocument();
  });

  it("renders modal element", () => {
    render(<Modal />);

    const modal = screen.getByTestId(/modal/i);
    expect(modal).toBeInTheDocument();

    const loader = screen.queryByRole("status");
    expect(loader).not.toBeInTheDocument();
  });

  it("calls closeModal on modal overlay click", async () => {
    const user = userEvent.setup();

    render(<Modal />);

    const modal = screen.getByTestId(/modal/i);
    await user.click(modal);

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("does not call closeModal when clicking inside the modal", async () => {
    const user = userEvent.setup();

    render(<Modal />);

    const heading = screen.getByRole("heading");
    await user.click(heading);

    expect(closeModal).not.toHaveBeenCalled();
  });

  it("renders modal content when modal type is form", () => {
    vi.mocked(useModal).mockReturnValue({
      type: "form",
      content: <p>Content</p>,
    });

    render(<Modal />);

    const content = screen.getByText(/content/i);
    expect(content).toBeInTheDocument();

    const cancelButton = screen.queryByRole("button", { name: /cancel/i });
    expect(cancelButton).not.toBeInTheDocument();

    const continueButton = screen.queryByRole("button", { name: /continue/i });
    expect(continueButton).not.toBeInTheDocument();
  });

  it("renders modal confirmation when modal type is confirm", () => {
    vi.mocked(useModal).mockReturnValue({
      type: "confirm",
    });

    render(<Modal />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeInTheDocument();
  });

  it("renders modal title", () => {
    vi.mocked(useModal).mockReturnValue({
      type: "confirm",
      title: "Are you sure you want to delete?",
    });

    render(<Modal />);

    const title = screen.getByText(/are you sure you want to delete/i);
    expect(title).toBeInTheDocument();
  });

  it("calls closeModal on cancel button click", async () => {
    const user = userEvent.setup();

    render(<Modal />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm on continue button click", async () => {
    const user = userEvent.setup();

    render(<Modal />);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    await user.click(continueButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal on close icon click", async () => {
    const user = userEvent.setup();

    render(<Modal />);

    const closeIcon = screen.getByRole("button", { name: /close/i });
    await user.click(closeIcon);

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal on escape keydown", () => {
    render(<Modal />);

    fireEvent.keyDown(window, {
      key: "Escape",
    });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
