import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useTabParams = (fallback, tabs) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || fallback;

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (!tab || !tabs.includes(activeTab.toLowerCase())) {
      setSearchParams({ tab: fallback });
    } else {
      setSearchParams({ tab: activeTab.toLowerCase() });
    }
  }, []);
};
