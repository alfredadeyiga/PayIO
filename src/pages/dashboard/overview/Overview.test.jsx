import { useProfile } from "../../../hooks/features/settings/useProfile";
import { useUpdateProfile } from "../../../hooks/features/settings/useUpdateProfile";
import { render, screen } from "../../../test/test-utils";
import Overview from "./Overview";

vi.mock("../../../hooks/features/settings/useProfile");

vi.mock("../../../hooks/features/settings/useUpdateProfile");

vi.mock("./components/Balance", () => ({
  default: () => <div>Balance Component</div>,
}));

vi.mock("./components/Goals", () => ({
  default: () => <div>Goals Component</div>,
}));

vi.mock("./components/Recents", () => ({
  default: () => <div>Recents Component</div>,
}));

vi.mock("./components/Upcoming", () => ({
  default: () => <div>Upcoming Component</div>,
}));

vi.mock("./components/Statistics", () => ({
  default: () => <div>Statistics Component</div>,
}));

vi.mock("./components/Expenses", () => ({
  default: () => <div>Expenses Component</div>,
}));

describe("Overview", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProfile).mockReturnValue({
      data: { id: "1", has_seen_tour: false },
    });

    vi.mocked(useUpdateProfile).mockReturnValue({
      mutate: vi.fn(),
    });
  });

  it("renders overview components", () => {
    render(<Overview />);

    expect(screen.getByText("Balance Component")).toBeInTheDocument();

    expect(screen.getByText("Goals Component")).toBeInTheDocument();

    expect(screen.getAllByText("Recents Component")).toHaveLength(2);

    expect(screen.getByText("Upcoming Component")).toBeInTheDocument();

    expect(screen.getByText("Statistics Component")).toBeInTheDocument();

    expect(screen.getByText("Expenses Component")).toBeInTheDocument();
  });

  it("renders tour when it has not been seen", () => {
    render(<Overview />);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("hides tour when it has been seen", () => {
    vi.mocked(useProfile).mockReturnValue({
      data: { id: "1", has_seen_tour: true },
    });

    render(<Overview />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
