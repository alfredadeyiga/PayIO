import { render, screen } from "../../test/test-utils";
import Section from "./Section";

describe("Section", () => {
  it("renders section title", () => {
    render(<Section title="Expenses" />);

    const title = screen.getByRole("heading", { name: /expenses/i });
    expect(title).toBeInTheDocument();
  });

  it("hides section title if title prop is not passed", () => {
    render(<Section />);

    const title = screen.queryByRole("heading", { level: 3 });
    expect(title).not.toBeInTheDocument();
  });

  it("renders route link", () => {
    render(<Section title="Expenses" route="/dashboard/expenses" />);

    const routeLink = screen.getByText(/view all/i);
    expect(routeLink).toBeInTheDocument();
  });

  it("hides route link if route prop is not passed", () => {
    render(<Section title="Expenses" />);

    const routeLink = screen.queryByText(/view all/i);
    expect(routeLink).not.toBeInTheDocument();
  });

  it("renders its children", () => {
    render(
      <Section>
        <p>Content</p>
      </Section>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
