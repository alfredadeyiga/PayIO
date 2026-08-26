import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../test/test-utils";
import Login from "./Login";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { login } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

vi.mock("../../context/AuthContext");

vi.mock("../../context/ModalContext");

vi.mock("../../api/auth", () => ({
  login: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

const navigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
}));

const setLoading = vi.fn();

describe("Login", () => {
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
    render(<Login />);

    const emailField = screen.getByLabelText(/email address/i);
    expect(emailField).toBeInTheDocument();

    const passwordField = screen.getByLabelText(/password/i);
    expect(passwordField).toBeInTheDocument();

    const passwordLink = screen.getByRole("link", { name: /forgot password/i });
    expect(passwordLink).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /login/i });
    expect(submitButton).toBeInTheDocument();

    const googleButton = screen.getByRole("button", { name: /google/i });
    expect(googleButton).toBeInTheDocument();

    const accountLink = screen.getByRole("link", {
      name: /create an account/i,
    });
    expect(accountLink).toBeInTheDocument();
  });

  it("toggles checked state on checkbox click", async () => {
    const user = userEvent.setup();

    render(<Login />);

    const checkbox = screen.getByRole("button", { name: /checkbox/i });

    expect(checkbox.querySelector(".text-border")).toBeInTheDocument();
    expect(checkbox.querySelector(".text-primary")).not.toBeInTheDocument();

    await user.click(checkbox);

    expect(checkbox.querySelector(".text-primary")).toBeInTheDocument();
    expect(checkbox.querySelector(".text-border")).not.toBeInTheDocument();
  });

  it("renders loader when button is loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: true,
    });

    render(<Login />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();

    const login = screen.queryByText(/login/i);
    expect(login).not.toBeInTheDocument();
  });

  it("handles login and navigates to dashboard overview on button click", async () => {
    const user = userEvent.setup();

    vi.mocked(login).mockResolvedValueOnce();

    render(<Login />);

    const emailField = screen.getByLabelText(/email address/i);
    await user.type(emailField, "user@example.com");

    const passwordField = screen.getByLabelText(/password/i);
    await user.type(passwordField, "1234");

    const submitButton = screen.getByRole("button", { name: /login/i });
    await user.click(submitButton);

    expect(login).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "1234",
    });

    expect(setLoading).toHaveBeenNthCalledWith(1, true);

    await waitFor(() => {
      expect(setLoading).toHaveBeenNthCalledWith(2, false);
      expect(navigate).toHaveBeenCalledWith("/dashboard/overview");
    });
  });

  it("shows a toast error on login error", async () => {
    const user = userEvent.setup();

    vi.mocked(login).mockRejectedValueOnce(new Error("Network Error"));

    render(<Login />);

    const emailField = screen.getByLabelText(/email address/i);
    await user.type(emailField, "user@example.com");

    const passwordField = screen.getByLabelText(/password/i);
    await user.type(passwordField, "1234");

    const submitButton = screen.getByRole("button", { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });
});
