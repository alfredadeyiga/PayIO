import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import Tabs from "./Tabs";

describe("Tabs", () => {
  const mockTabs = ["revenue", "expenses"];

  it("renders tabs", () => {
    render(<Tabs tabs={mockTabs} />);

    mockTabs.forEach((tab) =>
      expect(screen.getByRole("button", { name: tab })).toBeInTheDocument(),
    );
  });

  it("calls onChange on tab button click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Tabs tabs={mockTabs} onChange={onChange} />);

    const revenueTab = screen.getByRole("button", { name: "revenue" });
    await user.click(revenueTab);

    expect(onChange).toHaveBeenCalledWith("revenue");
  });
});
