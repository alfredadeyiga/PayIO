import { render, screen } from "../../../../test/test-utils";
import Comparison from "./Comparison";

vi.mock("../../../../components/ui/StatisticsCard", () => ({
  default: () => <div>Statistics Card</div>,
}));

describe("Comparison", () => {
  it("renders section title and statistics card", () => {
    render(<Comparison />);

    expect(screen.getByText(/expenses comparison/i)).toBeInTheDocument();

    expect(screen.getByText("Statistics Card")).toBeInTheDocument();
  });
});
