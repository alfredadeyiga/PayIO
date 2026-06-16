import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { useModal } from "../../../context/ModalContext";
import { createNotification } from "../../../api/notification";
import { formatShortMonth } from "../../../utils/formatDate";

export const useAddBills = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const { closeModal, setModalState } = useModal();

  return useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from("bills")
        .insert({ ...data, user_id: userId });

      if (error) throw error;
    },

    onMutate: () => setModalState({ isLoading: true }),

    onSuccess: (_, variables) => {
      toast.success("Bill added successfully");
      createNotification({
        userId,
        message: "New bill added",
        description: `Your bill "${variables.bill_name}" is due on ${formatShortMonth(variables.due_date)}`,
      });
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },

    onSettled: () => closeModal(),
  });
};
