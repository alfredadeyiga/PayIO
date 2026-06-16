import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";

export const useMarkNotification = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
};
