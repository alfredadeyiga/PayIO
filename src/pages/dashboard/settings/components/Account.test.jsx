import userEvent from "@testing-library/user-event";
import { useModal } from "../../../../context/ModalContext";
import { useProfile } from "../../../../hooks/features/settings/useProfile";
import { useUpdateProfile } from "../../../../hooks/features/settings/useUpdateProfile";
import { render, screen, waitFor } from "../../../../test/test-utils";
import Account from "./Account";
import { updateEmail } from "../../../../api/auth";
import { toast } from "react-toastify";
import { uploadAvatar } from "../../../../api/profile";

vi.mock("react-toastify");

vi.mock("../../../../context/ModalContext");

vi.mock("../../../../hooks/features/settings/useProfile");

vi.mock("../../../../hooks/features/settings/useUpdateProfile");

vi.mock("../../../../api/auth", () => ({
  updateEmail: vi.fn(),
}));

vi.mock("../../../../api/profile", () => ({
  uploadAvatar: vi.fn(),
}));

const mutate = vi.fn();

describe("Account", () => {
  const mockProfile = {
    id: 1,
    first_name: "Test",
    last_name: "User",
    email: "test@user.com",
    username: "test_user",
    phone: "+001234567890",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      isLoading: false,
    });

    vi.mocked(useProfile).mockReturnValue({
      data: mockProfile,
    });

    vi.mocked(useUpdateProfile).mockReturnValue({
      mutate,
    });
  });

  it("renders loader when isPending is true", () => {
    vi.mocked(useUpdateProfile).mockReturnValue({
      isPending: true,
    });

    render(<Account />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders default fields", () => {
    render(<Account />);

    expect(
      screen.getByRole("textbox", { name: /first name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /last name/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /username/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /phone number/i }),
    ).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    render(<Account />);

    expect(
      screen.getByPlaceholderText(mockProfile.first_name),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(mockProfile.last_name),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(mockProfile.email)).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(mockProfile.username),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("+00 | 12345 67890"),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/upload your photo/i)).toBeInTheDocument();
  });

  it("renders image file name and remove button on file change", async () => {
    const user = userEvent.setup();

    const file = new File(["image-content"], "user.png", {
      type: "image/*",
    });

    render(<Account />);

    const fileInput = screen.getByLabelText(/upload your photo/i);
    await user.upload(fileInput, file);

    expect(screen.getByText(file.name)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /remove file/i }),
    ).toBeInTheDocument();
  });

  it("updates profile on form submit", async () => {
    const user = userEvent.setup();

    vi.mocked(updateEmail).mockResolvedValueOnce();

    render(<Account />);

    const firstName = screen.getByRole("textbox", { name: /first name/i });
    await user.type(firstName, "Test1");

    const lastName = screen.getByRole("textbox", { name: /last name/i });
    await user.type(lastName, "User1");

    const email = screen.getByRole("textbox", { name: /email/i });
    await user.type(email, "test1@user.com");

    const username = screen.getByRole("textbox", { name: /username/i });
    await user.type(username, "test1_user1");

    const phoneNumber = screen.getByRole("textbox", { name: /phone number/i });
    await user.type(phoneNumber, "+011234567890");

    const submit = screen.getByRole("button", { name: /update profile/i });
    expect(submit).toBeInTheDocument();
    await user.click(submit);

    await waitFor(() =>
      expect(updateEmail).toHaveBeenCalledWith("test1@user.com"),
    );

    await waitFor(() => expect(toast.info).toHaveBeenCalledTimes(1));

    expect(mutate).toHaveBeenCalledWith({
      first_name: "Test1",
      last_name: "User1",
      username: "test1_user1",
      phone: "+011234567890",
    });
  });

  it("shows a toast error when email update fails", async () => {
    const user = userEvent.setup();

    vi.mocked(updateEmail).mockRejectedValueOnce(new Error("Error"));

    render(<Account />);

    const email = screen.getByRole("textbox", { name: /email/i });
    await user.type(email, "test1@user.com");

    const submit = screen.getByRole("button", { name: /update profile/i });
    await user.click(submit);

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });

  it("updates profile with avatar when there is selected file", async () => {
    const user = userEvent.setup();

    vi.mocked(uploadAvatar).mockResolvedValue("user-png.com");

    const file = new File(["image-content"], "user.png", {
      type: "image/*",
    });

    render(<Account />);

    const fileInput = screen.getByLabelText(/upload your photo/i);
    await user.upload(fileInput, file);

    const submit = screen.getByRole("button", { name: /update profile/i });
    await user.click(submit);

    await waitFor(() =>
      expect(uploadAvatar).toHaveBeenCalledWith(
        expect.anything(),
        mockProfile.id,
      ),
    );

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ avatar: "user-png.com" }),
    );
  });

  it("shows a toast error when any phone validator fails", async () => {
    const user = userEvent.setup();

    render(<Account />);

    const phoneNumber = screen.getByRole("textbox", { name: /phone number/i });
    await user.type(phoneNumber, "12345");

    const submit = screen.getByRole("button", { name: /update profile/i });
    await user.click(submit);

    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});
