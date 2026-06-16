import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

export const usePageTitle = (prefix, routes) => {
  const location = useLocation();

  useEffect(() => {
    const currentRoute = routes.find((route) =>
      matchPath(
        { path: `/${prefix}/${route.path}`, end: true },
        location.pathname,
      ),
    );

    document.title = currentRoute?.title || "PayIO";
  }, [location.pathname]);
};
