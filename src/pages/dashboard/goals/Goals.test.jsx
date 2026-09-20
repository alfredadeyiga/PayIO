import { render, screen } from "../../../test/test-utils";
import Goals from "./Goals";

vi.mock("./components/Category", () => ({
  default: () => <div>Category Component</div>,
}));

vi.mock("./components/Goal", () => ({
  default: () => <div>Goal Component</div>,
}));

vi.mock("./components/Summary", () => ({
  default: () => <div>Summary Component</div>,
}));

describe("Goals", () => {
  it("renders goals components", () => {
    render(<Goals />);

    expect(screen.getByText("Category Component")).toBeInTheDocument();

    expect(screen.getByText("Goal Component")).toBeInTheDocument();

    expect(screen.getByText("Summary Component")).toBeInTheDocument();
  });
});
