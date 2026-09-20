import userEvent from "@testing-library/user-event";
import NotFound from "./NotFound";
import { render, screen } from "../test/test-utils";

describe("NotFound", () => {
  it("renders default fields", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /go to dashboard/i }),
    ).toBeInTheDocument();
  });
});
