import { render } from "../../test/test-utils";
import SavingsChart from "./SavingsChart";

describe("SavingsChart", () => {
  it("renders reponsive container", () => {
    const { container } = render(<SavingsChart data={[]} />);

    const responsiveContainer = container.querySelector(
      ".recharts-responsive-container",
    );
    expect(responsiveContainer).toBeInTheDocument();
  });
});
