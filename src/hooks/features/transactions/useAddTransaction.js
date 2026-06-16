import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { useModal } from "../../../context/ModalContext";
import { createNotification } from "../../../api/notification";

export const useAddTransaction = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const { closeModal, setModalState } = useModal();

  return useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from("transactions")
        .insert({ ...data, user_id: userId });

      if (error) throw error;
    },

    onMutate: () => setModalState({ isLoading: true }),

    onSuccess: (_, variables) => {
      toast.success("Transaction added successfully");
      createNotification({
        userId,
        message: "New transaction added",
        description: `You added "${variables.item_name}" for $${variables.amount} at ${variables.shop_name}`,
      });
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },

    onSettled: () => closeModal(),
  });
};
