import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import Header from "./Header";
import { currentDate } from "../../utils/formatDate";
import { useTransactions } from "../../hooks/features/transactions/useTransactions";
import { useNotifications } from "../../hooks/features/notifications/useNotifications";
import { useProfile } from "../../hooks/features/settings/useProfile";

vi.mock("../../hooks/features/transactions/useTransactions");

vi.mock("../../hooks/features/notifications/useNotifications");

vi.mock("../../hooks/features/settings/useProfile");

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNotifications).mockReturnValue({
      data: [],
    });

    vi.mocked(useProfile).mockReturnValue({
      data: {
        first_name: "Alfred",
      },
    });
  });

  it("calls toggle sidebar on menu button click", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(<Header onToggleSidebar={handleToggle} />);

    const toggleButton = screen.getByRole("button", { name: /menu/i });
    expect(toggleButton).toBeInTheDocument();
    await user.click(toggleButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("renders the logo", () => {
    render(<Header />);

    const headingLogo = screen.getByRole("heading", { name: /payio/i });
    expect(headingLogo).toBeInTheDocument();
  });

  it("renders greeting with first name on overview page", () => {
    render(<Header />);

    const greeting = screen.getByText(/hello alfred/i);
    expect(greeting).toBeInTheDocument();
  });

  it("hides greeting on other pages", () => {
    render(<Header />, { route: "/dashboard/transactions" });

    const greeting = screen.queryByText(/hello/i);
    expect(greeting).not.toBeInTheDocument();
  });

  it("renders current date", () => {
    render(<Header />);

    const date = screen.getByText(currentDate);
    expect(date).toBeInTheDocument();
  });

  it("shows dropdown on notifications icon click", async () => {
    const user = userEvent.setup();

    render(<Header />);

    const notificationIcon = screen.getByLabelText(/notifications/i);
    expect(notificationIcon).toBeInTheDocument();
    await user.click(notificationIcon);

    const dropdown = screen.getByTestId(/notifications/i);
    expect(dropdown).toBeInTheDocument();
  });

  it("hides dropdown on double click", async () => {
    const user = userEvent.setup();

    render(<Header />);

    const notificationIcon = screen.getByLabelText(/notifications/i);
    await user.dblClick(notificationIcon);

    const dropdown = screen.queryByTestId(/notifications/i);
    expect(dropdown).not.toBeInTheDocument();
  });

  it("shows unread notifications indicator", () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: [{ is_read: false }, { is_read: true }],
    });

    render(<Header />);

    const unreadIndicator = screen.getByTestId("unread-indicator");
    expect(unreadIndicator).toBeInTheDocument();
  });

  it("hides unread notifications indicator when all are read", () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: [{ is_read: true }, { is_read: true }],
    });

    render(<Header />);

    const unreadIndicator = screen.queryByTestId("unread-indicator");
    expect(unreadIndicator).not.toBeInTheDocument();
  });

  it("shows search input on search button click", async () => {
    const user = userEvent.setup();

    render(<Header />);

    const searchButton = screen.getByLabelText(/search/i);
    expect(searchButton).toBeInTheDocument();
    await user.click(searchButton);

    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("matches search query and shows dropdown on input", async () => {
    const user = userEvent.setup();

    vi.mocked(useTransactions).mockReturnValue({
      data: [],
    });

    render(<Header />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "groceries");
    expect(searchInput).toHaveValue("groceries");

    const dropdown = screen.getByTestId(/search/i);
    expect(dropdown).toBeInTheDocument();
  });

  it("triggers search input focus on focus", async () => {
    const user = userEvent.setup();

    render(<Header />);

    const searchInput = screen.getByRole("textbox");
    await user.click(searchInput);
    expect(searchInput).toHaveFocus();
  });
});
