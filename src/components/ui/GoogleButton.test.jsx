import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import GoogleButton from "./GoogleButton";
import { googleSignIn } from "../../api/auth";
import { toast } from "react-toastify";

vi.mock("../../api/auth", () => ({
  googleSignIn: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

describe("GoogleButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the google sign in button", () => {
    render(<GoogleButton />);

    const googleButton = screen.getByRole("button", { name: /google/i });
    expect(googleButton).toBeInTheDocument();
  });

  it("calls handleSignIn on button click", async () => {
    const user = userEvent.setup();

    vi.mocked(googleSignIn).mockResolvedValueOnce();

    render(<GoogleButton />);

    const googleButton = screen.getByRole("button", { name: /google/i });
    await user.click(googleButton);

    expect(googleSignIn).toHaveBeenCalledTimes(1);
  });

  it("shows a toast error when sign in fails", async () => {
    const user = userEvent.setup();

    vi.mocked(googleSignIn).mockRejectedValueOnce(new Error("Network Error"));

    render(<GoogleButton />);

    const googleButton = screen.getByRole("button", { name: /google/i });
    await user.click(googleButton);

    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});
