import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { useModal } from "../../../context/ModalContext";

export const useUpdateTransaction = () => {
  const { closeModal, setModalState } = useModal();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },

    onMutate: () => setModalState({ isLoading: true }),

    onSuccess: () => {
      toast.success("Transaction updated successfully");
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },

    onSettled: () => closeModal(),
  });
};
