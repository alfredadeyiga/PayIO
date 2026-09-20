import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test/test-utils";
import Settings from "./Settings";

vi.mock("./components/Account", () => ({
  default: () => <div>Account Component</div>,
}));

vi.mock("./components/Security", () => ({
  default: () => <div>Security Component</div>,
}));

describe("Settings", () => {
  it("renders account component and default tabs", () => {
    render(<Settings />);

    expect(
      screen.getByRole("button", { name: /account/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /security/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/account component/i)).toBeInTheDocument();
  });

  it("renders security component when security tab is active", async () => {
    const user = userEvent.setup();

    render(<Settings />);

    const securityTab = screen.getByRole("button", { name: /security/i });
    await user.click(securityTab);

    expect(screen.getByText(/security component/i)).toBeInTheDocument();

    expect(screen.queryByText(/account component/i)).not.toBeInTheDocument();
  });
});
