import { render, screen } from "../../test/test-utils";
import Card from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(
      <Card>
        <p>Content</p>
      </Card>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
