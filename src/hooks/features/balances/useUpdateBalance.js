import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { useModal } from "../../../context/ModalContext";

export const useUpdateBalance = () => {
  const { closeModal, setModalState } = useModal();

  return useMutation({
    mutationFn: async ({ id, total }) => {
      const { error } = await supabase
        .from("balances")
        .update({ total })
        .eq("id", id);

      if (error) throw error;
    },

    onMutate: () => setModalState({ isLoading: true }),

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
      closeModal();
    },
  });
};
