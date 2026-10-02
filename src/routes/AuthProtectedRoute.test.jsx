import { render, screen } from "../test/test-utils";
import { useAuth } from "../context/AuthContext";
import AuthProtectedRoute from "./AuthProtectedRoute";

vi.mock("../context/AuthContext");

describe("AuthProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader when user is undefined", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: undefined,
    });

    render(<AuthProtectedRoute />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders its children when there is no user", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
    });

    render(<AuthProtectedRoute>Auth Content</AuthProtectedRoute>);

    expect(screen.getByText("Auth Content")).toBeInTheDocument();
  });

  it("redirects authenticated users and hides its children", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });

    render(<AuthProtectedRoute>Auth Content</AuthProtectedRoute>);

    expect(screen.queryByText("Auth Content")).not.toBeInTheDocument();
  });
});
