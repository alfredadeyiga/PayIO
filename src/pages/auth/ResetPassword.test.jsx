import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../test/test-utils";
import ResetPassword from "./ResetPassword";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { logout, updatePassword } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

vi.mock("../../context/AuthContext");

vi.mock("../../context/ModalContext");

vi.mock("../../api/auth", () => ({
  logout: vi.fn(),
  updatePassword: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const navigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
}));

const setLoading = vi.fn();

describe("ResetPassword", () => {
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
    render(<ResetPassword />);

    const heading = screen.getByRole("heading", { name: /reset password/i });
    expect(heading).toBeInTheDocument();

    const newPassword = screen.getByLabelText(/new password/i);
    expect(newPassword).toBeInTheDocument();

    const confirmPassword = screen.getByLabelText(/confirm password/i);
    expect(confirmPassword).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    expect(submitButton).toBeInTheDocument();
  });

  it("renders loader when button is loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: true,
    });

    render(<ResetPassword />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();

    const resetPassword = screen.queryByRole("button", {
      name: /reset password/i,
    });
    expect(resetPassword).not.toBeInTheDocument();
  });

  it("handles reset password and navigates to auth login on button click", async () => {
    const user = userEvent.setup();

    vi.mocked(updatePassword).mockResolvedValueOnce();

    vi.mocked(logout).mockResolvedValueOnce();

    render(<ResetPassword />);

    const newPassword = screen.getByLabelText(/new password/i);
    await user.type(newPassword, "1234");

    const confirmPassword = screen.getByLabelText(/confirm password/i);
    await user.type(confirmPassword, "1234");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    expect(updatePassword).toHaveBeenCalledWith("1234");

    expect(setLoading).toHaveBeenNthCalledWith(1, true);

    await waitFor(() => {
      expect(setLoading).toHaveBeenNthCalledWith(2, false);
      expect(logout).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("shows a toast error when logout error does not include password", async () => {
    const user = userEvent.setup();

    vi.mocked(logout).mockRejectedValueOnce(new Error("Network Error"));

    render(<ResetPassword />);

    const newPassword = screen.getByLabelText(/new password/i);
    await user.type(newPassword, "1234");

    const confirmPassword = screen.getByLabelText(/confirm password/i);
    await user.type(confirmPassword, "1234");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });

  it("shows a text error when reset password error includes password", async () => {
    const user = userEvent.setup();

    vi.mocked(updatePassword).mockRejectedValueOnce(
      new Error("Password Error"),
    );

    render(<ResetPassword />);

    const newPassword = screen.getByLabelText(/new password/i);
    await user.type(newPassword, "1234");

    const confirmPassword = screen.getByLabelText(/confirm password/i);
    await user.type(confirmPassword, "1234");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/password error/i)).toBeInTheDocument(),
    );
  });

  it("shows a confirmation error when passwords do not match", async () => {
    const user = userEvent.setup();

    render(<ResetPassword />);

    const newPassword = screen.getByLabelText(/new password/i);
    await user.type(newPassword, "1234");

    const confirmPassword = screen.getByLabelText(/confirm password/i);
    await user.type(confirmPassword, "12345");

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Must match new password")).toBeInTheDocument();
      expect(setLoading).toHaveBeenNthCalledWith(2, false);
      expect(updatePassword).not.toHaveBeenCalled();
      expect(logout).not.toHaveBeenCalled();
    });
  });
});
