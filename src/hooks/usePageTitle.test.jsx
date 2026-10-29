import { render } from "../test/test-utils";
import { usePageTitle } from "./usePageTitle";

const PageTitleProbe = ({ prefix = "dashboard", routes }) => {
  usePageTitle(prefix, routes);

  return null;
};

describe("usePageTitle", () => {
  test("sets page title to route title", () => {
    const routes = [{ path: "overview", title: "Overview" }];

    render(<PageTitleProbe routes={routes} />, {
      route: "/dashboard/overview",
    });

    expect(document.title).toBe("Overview");
  });

  test("sets page title to default when there is no route title", () => {
    const routes = [{ path: "balances" }];

    render(<PageTitleProbe routes={routes} />, {
      route: "/dashboard/balances",
    });

    expect(document.title).toBe("PayIO");
  });
});
