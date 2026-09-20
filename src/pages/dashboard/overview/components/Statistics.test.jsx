import { render, screen } from "../../../../test/test-utils";
import Statistics from "./Statistics";

vi.mock("../../../../components/ui/StatisticsCard", () => ({
  default: () => <div>Statistics Card</div>,
}));

describe("Statistics", () => {
  it("renders statistics card", () => {
    render(<Statistics />);

    expect(screen.getByText("Statistics Card")).toBeInTheDocument();
  });
});
