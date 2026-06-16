import { QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        toast.error(error.message || "Error retrieving data");
      },
      refetchOnWindowFocus: false,
    },
  },
});
