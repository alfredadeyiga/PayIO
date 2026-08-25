import { render, screen } from "../../test/test-utils";
import NotificationsDropdown from "./NotificationsDropdown";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "../../hooks/features/notifications/useNotifications";
import { useMarkNotification } from "../../hooks/features/notifications/useMarkNotification";
import { formatDistanceToNow } from "date-fns";

vi.mock("../../hooks/features/notifications/useNotifications");

vi.mock("../../hooks/features/notifications/useMarkNotification");

vi.mock("date-fns", () => ({
  formatDistanceToNow: vi.fn(),
}));

const markAsRead = vi.fn();

describe("NotificationsDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNotifications).mockReturnValue({
      data: [],
    });

    vi.mocked(useMarkNotification).mockReturnValue({
      mutate: markAsRead,
    });
  });

  it("calls onClose on close button click", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<NotificationsDropdown onClose={handleClose} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("hides loader by default", () => {
    render(<NotificationsDropdown />);

    const loader = screen.queryByRole("status");
    expect(loader).not.toBeInTheDocument();
  });

  it("renders loader when isLoading is true", () => {
    vi.mocked(useNotifications).mockReturnValue({
      isLoading: true,
    });

    render(<NotificationsDropdown />);

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
  });

  it("renders no notifications when there are no notifications", () => {
    render(<NotificationsDropdown />);

    const emptyNotifs = screen.getByText(/no notifications/i);
    expect(emptyNotifs).toBeInTheDocument();
  });

  it("renders notifications", () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: [{ id: "1", message: "New transaction", created_at: "2026-08-07" }],
    });

    render(<NotificationsDropdown />);

    const notifMessage = screen.getByText(/new transaction/i);
    expect(notifMessage).toBeInTheDocument();

    expect(formatDistanceToNow).toHaveBeenCalled();

    const emptyNotifs = screen.queryByText(/no notifications/i);
    expect(emptyNotifs).not.toBeInTheDocument();
  });

  it("hides description by default", () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: [{ id: "1", description: "New transaction added" }],
    });

    render(<NotificationsDropdown />);

    const notifDescription = screen.queryByText(/new transaction added/i);
    expect(notifDescription).not.toBeInTheDocument();
  });

  it("renders description on notification click", async () => {
    const user = userEvent.setup();

    vi.mocked(useNotifications).mockReturnValue({
      data: [
        {
          id: "1",
          message: "New transaction",
          description: "New transaction added",
        },
      ],
    });

    render(<NotificationsDropdown />);

    const notifMessage = screen.getByText(/new transaction/i);
    await user.click(notifMessage);

    const notifDescription = screen.getByText(/new transaction added/i);
    expect(notifDescription).toBeInTheDocument();
  });

  it("hides description on double click", async () => {
    const user = userEvent.setup();

    vi.mocked(useNotifications).mockReturnValue({
      data: [
        {
          id: "1",
          message: "New transaction",
          description: "New transaction added",
        },
      ],
    });

    render(<NotificationsDropdown />);

    const notifMessage = screen.getByText(/new transaction/i);
    await user.dblClick(notifMessage);

    const notifDescription = screen.queryByText(/new transaction added/i);
    expect(notifDescription).not.toBeInTheDocument();
  });

  it("marks unread notifications as read", async () => {
    const user = userEvent.setup();

    vi.mocked(useNotifications).mockReturnValue({
      data: [
        {
          id: "1",
          message: "New transaction",
          is_read: false,
        },
      ],
    });

    render(<NotificationsDropdown />);

    const notifMessage = screen.getByText(/new transaction/i);
    await user.click(notifMessage);

    expect(markAsRead).toHaveBeenCalledWith("1");
  });

  it("does not mark read notifications", async () => {
    const user = userEvent.setup();

    vi.mocked(useNotifications).mockReturnValue({
      data: [
        {
          id: "1",
          message: "New transaction",
          is_read: true,
        },
      ],
    });

    render(<NotificationsDropdown />);

    const notifMessage = screen.getByText(/new transaction/i);
    await user.click(notifMessage);

    expect(markAsRead).not.toHaveBeenCalled();
  });

  it("shows unread indicator", () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: [{ id: "1", is_read: false }],
    });

    render(<NotificationsDropdown />);

    const unreadIndicator = screen.getByTestId("unread-indicator");
    expect(unreadIndicator).toBeInTheDocument();
  });

  it("hides unread indicator for read notification", () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: [{ id: "1", is_read: true }],
    });

    render(<NotificationsDropdown />);

    const unreadIndicator = screen.queryByTestId("unread-indicator");
    expect(unreadIndicator).not.toBeInTheDocument();
  });
});
