import { render, screen } from "../test/test-utils";
import DashboardLayout from "./DashboardLayout";
import { useModal } from "../context/ModalContext";
import { useProfile } from "../hooks/features/settings/useProfile";
import { useTransactions } from "../hooks/features/transactions/useTransactions";
import { useBalances } from "../hooks/features/balances/useBalances";
import { useGoals } from "../hooks/features/goals/useGoals";
import { useBills } from "../hooks/features/bills/useBills";
import { useNotifications } from "../hooks/features/notifications/useNotifications";

vi.mock("../context/ModalContext");

vi.mock("../context/AuthContext");

vi.mock("../hooks/features/settings/useProfile");

vi.mock("../hooks/features/transactions/useTransactions");

vi.mock("../hooks/features/balances/useBalances");

vi.mock("../hooks/features/goals/useGoals");

vi.mock("../hooks/features/bills/useBills");

vi.mock("../hooks/features/notifications/useNotifications");

describe("DashboardLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      isOpen: false,
    });

    vi.mocked(useProfile).mockReturnValue({
      isLoading: false,
    });

    vi.mocked(useTransactions).mockReturnValue({
      isLoading: false,
    });

    vi.mocked(useBalances).mockReturnValue({
      isLoading: false,
    });

    vi.mocked(useGoals).mockReturnValue({
      isLoading: false,
    });

    vi.mocked(useBills).mockReturnValue({
      isLoading: false,
    });

    vi.mocked(useNotifications).mockReturnValue({
      isLoading: false,
    });
  });

  it("renders loader when profile is loading", () => {
    vi.mocked(useProfile).mockReturnValue({
      isLoading: true,
    });

    render(<DashboardLayout />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
  });

  it("renders loader when another query table is loading", () => {
    vi.mocked(useTransactions).mockReturnValue({
      isLoading: true,
    });

    render(<DashboardLayout />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
  });

  it("renders default elements without modal", () => {
    render(<DashboardLayout />);

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toBeInTheDocument();

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    const modal = screen.queryByTestId(/modal/i);
    expect(modal).not.toBeInTheDocument();

    const loader = screen.queryByRole("status");
    expect(loader).not.toBeInTheDocument();
  });

  it("renders modal when it is open", () => {
    vi.mocked(useModal).mockReturnValue({
      isOpen: true,
    });

    render(<DashboardLayout />);

    const modal = screen.getByTestId(/modal/i);
    expect(modal).toBeInTheDocument();
  });
});
