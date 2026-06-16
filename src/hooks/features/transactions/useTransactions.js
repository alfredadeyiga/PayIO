import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

const fetchTransactions = async (userId) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
};

export const useTransactions = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => fetchTransactions(userId),
    enabled: !!userId,
  });
};
