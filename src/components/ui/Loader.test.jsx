import { render, screen } from "../../test/test-utils";
import Loader from "./Loader";

describe("Loader", () => {
  it("renders loading text by default", () => {
    render(<Loader />);

    const loadingText = screen.getByText(/loading/i);
    expect(loadingText).toBeInTheDocument();
  });

  it("hides loading text when variant is not overlay", () => {
    render(<Loader variant="button" />);

    const loadingText = screen.queryByText(/loading/i);
    expect(loadingText).not.toBeInTheDocument();
  });
});
