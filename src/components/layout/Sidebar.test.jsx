import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import Sidebar from "./Sidebar";
import { dashboardRoutes } from "../../routes/dashboardRoutes";
import { useModal } from "../../context/ModalContext";
import { useProfile } from "../../hooks/features/settings/useProfile";

vi.mock("../../hooks/features/settings/useProfile");

vi.mock("../../context/ModalContext");

const openModal = vi.fn();

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useModal).mockReturnValue({
      openModal,
    });

    vi.mocked(useProfile).mockReturnValue({
      data: {
        first_name: "Alfred",
        last_name: "Adeyiga",
      },
    });
  });

  it("renders the logo", () => {
    render(<Sidebar />);

    const headingLogo = screen.getByRole("heading", { name: /payio/i });
    expect(headingLogo).toBeInTheDocument();
  });

  it("renders all sidebar navigation items", () => {
    render(<Sidebar />);

    dashboardRoutes
      .filter((route) => route.showInSidebar)
      .forEach((route) => {
        expect(screen.getByText(route.title)).toBeInTheDocument();
      });
  });

  it("calls close sidebar and opens the logout confirmation on logout", async () => {
    const user = userEvent.setup();
    const onCloseSidebar = vi.fn();

    render(<Sidebar onCloseSidebar={onCloseSidebar} />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    await user.click(logoutButton);

    expect(onCloseSidebar).toHaveBeenCalledTimes(1);

    expect(openModal).toHaveBeenCalledWith(
      expect.objectContaining({
        onConfirm: expect.any(Function),
      }),
    );
  });

  it("renders profile avatar", () => {
    vi.mocked(useProfile).mockReturnValue({
      data: {
        avatar: "avatar.png",
      },
    });

    render(<Sidebar />);

    const avatar = screen.getByAltText("avatar");
    expect(avatar).toHaveAttribute("src", expect.stringContaining("avatar"));
  });

  it("renders default avatar when none exists", () => {
    render(<Sidebar />);

    const avatar = screen.getByAltText("avatar");
    expect(avatar).toHaveAttribute("src", expect.stringContaining("default"));
  });

  it("renders full name and profile link", () => {
    render(<Sidebar />);

    const profileLink = screen.getByText(/view profile/i);
    expect(profileLink).toBeInTheDocument();

    const fullName = screen.getByText(/alfred adeyiga/i);
    expect(fullName).toBeInTheDocument();
  });
});
