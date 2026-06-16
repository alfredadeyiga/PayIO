import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { formatCapitalize } from "../../../utils/formatCapitalize";
import { createNotification } from "../../../api/notification";

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const queryClient = useQueryClient();

  const customDescriptions = {
    first_name: "Your first name was changed",
    last_name: "Your last name was changed",
    username: "Your username was changed",
    phone: "Your phone number was changed",
    avatar: "Your profile picture was changed",
  };

  return useMutation({
    mutationFn: async (updates) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;
    },

    onSuccess: (_, variables) => {
      const varObj = Object.keys(variables);

      const hasTour = varObj.includes("has_seen_tour");

      if (!hasTour) {
        queryClient.invalidateQueries(["profile", userId]);

        toast.success("Your profile has been updated");

        const descriptions = varObj.map((key) => customDescriptions[key]);

        descriptions.forEach((desc) => {
          createNotification({
            userId,
            message: "Your account has been updated",
            description: desc,
          });
        });
      }
    },

    onError: (error) => {
      if (error.message.includes("duplicate")) {
        toast.error("User already exists");
      } else {
        toast.error(formatCapitalize(error.message) || "Something went wrong");
      }
    },
  });
};
