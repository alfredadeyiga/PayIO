import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useTabParams = (fallback, tabs) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab")?.toLowerCase();

    if (!tab || !tabs.includes(tab)) {
      setSearchParams({ tab: fallback });
      return;
    }

    if (tab !== searchParams.get("tab")) {
      setSearchParams({ tab });
    }
  }, [searchParams, tabs, fallback, setSearchParams]);
};
