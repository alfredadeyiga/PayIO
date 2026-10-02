import { render, screen } from "../test/test-utils";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../context/AuthContext");

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader when user is undefined", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: undefined,
    });

    render(<ProtectedRoute />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders its children when there is a user", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });

    render(<ProtectedRoute>Dashboard Content</ProtectedRoute>);

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("redirects unauthenticated users and hides its children", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
    });

    render(<ProtectedRoute>Dashboard Content</ProtectedRoute>);

    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });
});
