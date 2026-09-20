import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../../../test/test-utils";
import Security from "./Security";
import { useAuth } from "../../../../context/AuthContext";
import { useModal } from "../../../../context/ModalContext";
import { toast } from "react-toastify";
import { updateCurrentPassword } from "../../../../api/auth";
import { createNotification } from "../../../../api/notification";

vi.mock("../../../../context/AuthContext");

vi.mock("../../../../context/ModalContext");

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("../../../../api/auth", () => ({
  updateCurrentPassword: vi.fn(),
}));

vi.mock("../../../../api/notification", () => ({
  createNotification: vi.fn(),
}));

describe("Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });

    vi.mocked(useModal).mockReturnValue({
      isLoading: false,
    });
  });

  it("renders default fields", () => {
    render(<Security />);

    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/retype password/i)).toBeInTheDocument();
  });

  it("updates password on form submit", async () => {
    const user = userEvent.setup();

    vi.mocked(updateCurrentPassword).mockResolvedValueOnce();

    render(<Security />);

    const currentPassword = screen.getByLabelText(/current password/i);
    await user.type(currentPassword, "1234");

    const newPassword = screen.getByLabelText(/new password/i);
    await user.type(newPassword, "12345");

    const retypePassword = screen.getByLabelText(/retype password/i);
    await user.type(retypePassword, "12345");

    const submit = screen.getByRole("button", { name: /update password/i });
    expect(submit).toBeInTheDocument();
    await user.click(submit);

    await waitFor(() =>
      expect(updateCurrentPassword).toHaveBeenCalledWith({
        password: "12345",
        currentPassword: "1234",
      }),
    );

    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));

    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "1" }),
    );
  });

  it("shows a toast error when password update fails", async () => {
    const user = userEvent.setup();

    vi.mocked(updateCurrentPassword).mockRejectedValueOnce(new Error("Error"));

    render(<Security />);

    const currentPassword = screen.getByLabelText(/current password/i);
    await user.type(currentPassword, "1234");

    const newPassword = screen.getByLabelText(/new password/i);
    await user.type(newPassword, "12345");

    const retypePassword = screen.getByLabelText(/retype password/i);
    await user.type(retypePassword, "12345");

    const submit = screen.getByRole("button", { name: /update password/i });
    await user.click(submit);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });

  it("shows a toast error when retype password does not match", async () => {
    const user = userEvent.setup();

    render(<Security />);

    const currentPassword = screen.getByLabelText(/current password/i);
    await user.type(currentPassword, "1234");

    const newPassword = screen.getByLabelText(/new password/i);
    await user.type(newPassword, "12345");

    const retypePassword = screen.getByLabelText(/retype password/i);
    await user.type(retypePassword, "123456");

    const submit = screen.getByRole("button", { name: /update password/i });
    await user.click(submit);

    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});
