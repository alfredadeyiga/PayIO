import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../test/test-utils";
import Signup from "./Signup";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { signup } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

vi.mock("../../context/AuthContext");

vi.mock("../../context/ModalContext");

vi.mock("../../api/auth", () => ({
  signup: vi.fn(),
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

describe("Signup", () => {
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
    render(<Signup />);

    const heading = screen.getByRole("heading", { name: /create an account/i });
    expect(heading).toBeInTheDocument();

    const firstName = screen.getByLabelText(/first name/i);
    expect(firstName).toBeInTheDocument();

    const lastName = screen.getByLabelText(/last name/i);
    expect(lastName).toBeInTheDocument();

    const emailField = screen.getByLabelText(/email address/i);
    expect(emailField).toBeInTheDocument();

    const passwordField = screen.getByLabelText(/password/i);
    expect(passwordField).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: /sign up/i,
    });
    expect(submitButton).toBeInTheDocument();

    const googleButton = screen.getByRole("button", { name: /google/i });
    expect(googleButton).toBeInTheDocument();

    const signinLink = screen.getByRole("link", {
      name: /sign in/i,
    });
    expect(signinLink).toBeInTheDocument();
  });

  it("renders loader when button is loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      loading: true,
    });

    render(<Signup />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();

    const signup = screen.queryByRole("button", {
      name: /sign up/i,
    });
    expect(signup).not.toBeInTheDocument();
  });

  it("handles sign up and navigates to dashboard overview on button click", async () => {
    const user = userEvent.setup();

    vi.mocked(signup).mockResolvedValueOnce();

    render(<Signup />);

    const firstName = screen.getByLabelText(/first name/i);
    await user.type(firstName, "Test");

    const lastName = screen.getByLabelText(/last name/i);
    await user.type(lastName, "User");

    const emailField = screen.getByLabelText(/email address/i);
    await user.type(emailField, "user@test.com");

    const passwordField = screen.getByLabelText(/password/i);
    await user.type(passwordField, "1234");

    const submitButton = screen.getByRole("button", {
      name: /sign up/i,
    });
    await user.click(submitButton);

    expect(signup).toHaveBeenCalledWith({
      email: "user@test.com",
      password: "1234",
      firstName: "Test",
      lastName: "User",
    });

    expect(setLoading).toHaveBeenNthCalledWith(1, true);

    await waitFor(() => {
      expect(setLoading).toHaveBeenNthCalledWith(2, false);
      expect(signup).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/dashboard/overview");
    });
  });

  it("shows a password error when signup error includes password", async () => {
    const user = userEvent.setup();

    vi.mocked(signup).mockRejectedValueOnce(new Error("Password Error"));

    render(<Signup />);

    const firstName = screen.getByLabelText(/first name/i);
    await user.type(firstName, "Test");

    const lastName = screen.getByLabelText(/last name/i);
    await user.type(lastName, "User");

    const emailField = screen.getByLabelText(/email address/i);
    await user.type(emailField, "user@test.com");

    const passwordField = screen.getByLabelText(/password/i);
    await user.type(passwordField, "1234");

    const submitButton = screen.getByRole("button", {
      name: /sign up/i,
    });
    await user.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/password error/i)).toBeInTheDocument(),
    );
  });

  it("shows an email error when sign up error includes user", async () => {
    const user = userEvent.setup();

    vi.mocked(signup).mockRejectedValueOnce(new Error("User Error"));

    render(<Signup />);

    const firstName = screen.getByLabelText(/first name/i);
    await user.type(firstName, "Test");

    const lastName = screen.getByLabelText(/last name/i);
    await user.type(lastName, "User");

    const emailField = screen.getByLabelText(/email address/i);
    await user.type(emailField, "user@test.com");

    const passwordField = screen.getByLabelText(/password/i);
    await user.type(passwordField, "1234");

    const submitButton = screen.getByRole("button", {
      name: /sign up/i,
    });
    await user.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/user error/i)).toBeInTheDocument(),
    );
  });

  it("shows a toast error by default", async () => {
    const user = userEvent.setup();

    vi.mocked(signup).mockRejectedValueOnce(new Error("Network Error"));

    render(<Signup />);

    const firstName = screen.getByLabelText(/first name/i);
    await user.type(firstName, "Test");

    const lastName = screen.getByLabelText(/last name/i);
    await user.type(lastName, "User");

    const emailField = screen.getByLabelText(/email address/i);
    await user.type(emailField, "user@test.com");

    const passwordField = screen.getByLabelText(/password/i);
    await user.type(passwordField, "1234");

    const submitButton = screen.getByRole("button", {
      name: /sign up/i,
    });
    await user.click(submitButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });
});
