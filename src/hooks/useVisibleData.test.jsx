import { act, renderHook } from "../../src/test/test-utils";
import { useVisibleData } from "./useVisibleData";

describe("useVisibleData", () => {
  const data = [
    { id: "1", amount: 500 },
    { id: "2", amount: 1500 },
    { id: "3", amount: 100 },
  ];

  const count = 2;

  test("renders visible data based on count", () => {
    const { result } = renderHook(() => useVisibleData(count, data));

    expect(result.current.visibleData).toHaveLength(2);
  });

  test("sets hasMore to true when more data exists", () => {
    const { result } = renderHook(() => useVisibleData(count, data));

    expect(result.current.hasMore).toBe(true);
  });

  test("sets hasMore to false when all data is visible", () => {
    const data = [{ id: "1", amount: 500 }];

    const { result } = renderHook(() => useVisibleData(count, data));

    expect(result.current.hasMore).toBe(false);
  });

  test("increments the visible count", () => {
    const { result } = renderHook(() => useVisibleData(count, data));

    act(() => result.current.loadMore());

    expect(result.current.visibleData).toHaveLength(data.length);

    expect(result.current.hasMore).toBe(false);
  });
});
