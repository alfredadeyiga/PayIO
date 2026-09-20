import { render, screen } from "../../../test/test-utils";
import Expenses from "./Expenses";

vi.mock("./components/Comparison", () => ({
  default: () => <div>Comparison Component</div>,
}));

vi.mock("./components/Breakdown", () => ({
  default: () => <div>Breakdown Component</div>,
}));

describe("Expenses", () => {
  it("renders comparison and breakdown components", () => {
    render(<Expenses />);

    expect(screen.getByText("Comparison Component")).toBeInTheDocument();

    expect(screen.getByText("Breakdown Component")).toBeInTheDocument();
  });
});
