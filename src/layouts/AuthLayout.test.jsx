import { render, screen } from "../test/test-utils";
import AuthLayout from "./AuthLayout";

describe("AuthLayout", () => {
  it("renders auth layout", () => {
    render(<AuthLayout />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
