import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../test/test-utils";
import ForgotPassword from "./ForgotPassword";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { sendResetLink } from "../../api/auth";
import { toast } from "react-toastify";

vi.mock("../../context/AuthContext");

vi.mock("../../context/ModalContext");

vi.mock("../../api/auth", () => ({
  sendResetLink: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { info: vi.fn(), error: vi.fn() },
}));

const setLoading = vi.fn();

describe("ForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      loading: false,
      setLoading,
    });

    vi.mocked(useModal).mockReturnValue({
      isLoading: false,
    });
  });

  it("renders default fields", () => {
    render(<ForgotPassword />);

    const heading = screen.getByRole("heading", { name: /forgot password/i });
    expect(heading).toBeInTheDocument();

    const emailField = screen.getByLabelText(/email address/i);
    expect(emailField).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /send email/i });
    expect(submitButton).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
  });

  it("renders loader and disables button when button is loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: true,
    });

    render(<ForgotPassword />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();

    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeDisabled();

    const sendEmail = screen.queryByText(/send email/i);
    expect(sendEmail).not.toBeInTheDocument();
  });

  it("handles send reset link and toast info on button click", async () => {
    const user = userEvent.setup();

    vi.mocked(sendResetLink).mockResolvedValueOnce();

    render(<ForgotPassword />);

    const emailField = screen.getByLabelText(/email address/i);
    await user.type(emailField, "user@example.com");

    const submitButton = screen.getByRole("button", { name: /send email/i });
    await user.click(submitButton);

    expect(sendResetLink).toHaveBeenCalledWith("user@example.com");

    expect(setLoading).toHaveBeenNthCalledWith(1, true);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledTimes(1);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);
    });
  });

  it("shows a toast error on reset link error", async () => {
    const user = userEvent.setup();

    vi.mocked(sendResetLink).mockRejectedValueOnce(new Error("Network Error"));

    render(<ForgotPassword />);

    const emailField = screen.getByLabelText(/email address/i);
    await user.type(emailField, "user@example.com");

    const submitButton = screen.getByRole("button", { name: /send email/i });
    await user.click(submitButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });
});
