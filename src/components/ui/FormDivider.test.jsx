import { render, screen } from "../../test/test-utils";
import FormDivider from "./FormDivider";

describe("FormDivider", () => {
  it("renders sign up text and hr element", () => {
    render(<FormDivider />);

    const signUp = screen.getByText(/sign up/i);
    expect(signUp).toBeInTheDocument();

    const hrElement = screen.getByRole("separator");
    expect(hrElement).toBeInTheDocument();
  });
});
