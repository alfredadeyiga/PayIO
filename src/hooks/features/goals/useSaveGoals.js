import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { useModal } from "../../../context/ModalContext";
import { createNotification } from "../../../api/notification";

export const useSaveGoals = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const { closeModal, setModalState } = useModal();

  return useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from("goals")
        .upsert({ ...data, user_id: userId }, { onConflict: "user_id,period" });

      if (error) throw error;
    },

    onMutate: () => setModalState({ isLoading: true }),

    onSuccess: (_, variables) => {
      const hasTarget = !!variables.target;

      if (hasTarget) {
        createNotification({
          userId,
          message: "Monthly goal has been updated",
          description: `You have saved $${variables.achieved} out of your target of $${variables.target}`,
        });
      }

      toast.success("Goal updated successfully");
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },

    onSettled: () => closeModal(),
  });
};
