import { renderHook } from "../test/test-utils";
import { useFilteredTransactions } from "./useFilteredTransactions";

describe("useFilteredTransactions", () => {
  const transactions = [
    {
      id: "1",
      transaction_type: "revenue",
      amount: 600,
    },
    {
      id: "2",
      transaction_type: "expenses",
      amount: 500,
    },
  ];

  test("returns all transactions when active tab is all", () => {
    const { result } = renderHook(() =>
      useFilteredTransactions(transactions, "all"),
    );

    expect(result.current).toHaveLength(2);
  });

  test("returns revenue transactions when active tab is revenue", () => {
    const { result } = renderHook(() =>
      useFilteredTransactions(transactions, "revenue"),
    );

    expect(result.current).toHaveLength(1);

    expect(result.current[0].transaction_type).toBe("revenue");
  });

  test("returns expense transactions when active tab is expenses", () => {
    const { result } = renderHook(() =>
      useFilteredTransactions(transactions, "expenses"),
    );

    expect(result.current).toHaveLength(1);

    expect(result.current[0].transaction_type).toBe("expenses");
  });
});
