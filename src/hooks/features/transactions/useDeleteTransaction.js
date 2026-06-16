import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { useModal } from "../../../context/ModalContext";
import { useAuth } from "../../../context/AuthContext";

export const useDeleteTransaction = () => {
  const { closeModal, setModalState } = useModal();

  const queryClient = useQueryClient();

  const { user } = useAuth();

  const userId = user?.id;

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },

    onMutate: () => setModalState({ isLoading: true }),

    onSuccess: () => {
      toast.success("Transaction deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["transactions", userId],
      });
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },

    onSettled: () => closeModal(),
  });
};
