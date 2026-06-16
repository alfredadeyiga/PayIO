import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { useModal } from "../../../context/ModalContext";
import { useAuth } from "../../../context/AuthContext";

export const useDeleteBills = () => {
  const { closeModal, setModalState } = useModal();

  const queryClient = useQueryClient();

  const { user } = useAuth();

  const userId = user?.id;

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("bills").delete().eq("id", id);

      if (error) throw error;
    },

    onMutate: () => setModalState({ isLoading: true }),

    onSuccess: () => {
      toast.success("Bill deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["bills", userId],
      });
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },

    onSettled: () => closeModal(),
  });
};
