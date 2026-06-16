import { useState } from "react";

export function useVisibleData(count, data) {
  const [visibleCount, setVisibleCount] = useState(count);

  const visibleData = data?.slice(0, visibleCount);

  function loadMore() {
    setVisibleCount((prev) => prev + count);
  }

  const hasMore = visibleCount < data?.length;

  return { visibleData, loadMore, hasMore };
}
