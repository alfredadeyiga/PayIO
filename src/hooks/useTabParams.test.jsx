import { useSearchParams } from "react-router-dom";
import { render, screen } from "../test/test-utils";
import { useTabParams } from "./useTabParams";

const tabs = ["all", "revenue", "expenses"];

const TabParamsProbe = ({ fallback }) => {
  useTabParams(fallback, tabs);

  const [params] = useSearchParams();

  const tab = params.get("tab");

  return <output data-testid="tab">{tab}</output>;
};

describe("useTabParams", () => {
  test("preserves a valid tab parameter", async () => {
    render(<TabParamsProbe />, {
      route: "/dashboard/transactions?tab=revenue",
    });

    expect(await screen.findByTestId("tab")).toHaveTextContent("revenue");
  });

  test("normalizes the tab parameter to lowercase", async () => {
    render(<TabParamsProbe />, {
      route: "/dashboard/transactions?tab=EXPENSES",
    });

    expect(await screen.findByTestId("tab")).toHaveTextContent("expenses");
  });

  test("uses the supplied fallback tab", async () => {
    render(<TabParamsProbe fallback="all" />, {
      route: "/dashboard/transactions?tab=unknown",
    });

    expect(await screen.findByTestId("tab")).toHaveTextContent("all");
  });

  test("uses the supplied fallback when the tab parameter is missing", async () => {
    render(<TabParamsProbe fallback="all" />, {
      route: "/dashboard/transactions",
    });

    expect(await screen.findByTestId("tab")).toHaveTextContent("all");
  });
});
