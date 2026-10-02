import { render, screen } from "../test/test-utils";
import RealtimeProvider from "./RealtimeProvider";

vi.mock("../hooks/useRealtimeTable");

describe("RealtimeProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders its children", () => {
    render(<RealtimeProvider>Content</RealtimeProvider>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
