import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";
import { useModal } from "../../../context/ModalContext";
import { createNotification } from "../../../api/notification";
import { formatCapitalize } from "../../../utils/formatCapitalize";
import { formatAccountNumber } from "../../../utils/formatAccountNumber";

export const useAddBalance = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const { closeModal, setModalState } = useModal();

  return useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from("balances")
        .insert({ ...data, user_id: userId });

      if (error) throw error;
    },

    onMutate: () => setModalState({ isLoading: true }),

    onSuccess: (_, variables) => {
      toast.success("Account added successfully");

      const accountNumber = formatAccountNumber(variables.account_number, {
        type: variables.type,
      });

      createNotification({
        userId,
        message: "New payment method added",
        description: `${formatCapitalize(variables.type)} number ${accountNumber} has been added to balances`,
      });
    },

    onError: (error) => {
      if (error.message.includes("duplicate")) {
        toast.error("Account number already exists");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    },

    onSettled: () => closeModal(),
  });
};
