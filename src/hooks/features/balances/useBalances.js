import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { getLogo } from "../../../utils/getLogo";

const fetchBalances = async (userId) => {
  const { data, error } = await supabase
    .from("balances")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const useBalances = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ["balances", userId],
    queryFn: () => fetchBalances(userId),
    enabled: !!userId,
    select: (data) =>
      data.map((balance) => ({
        ...balance,
        icon: balance.type.includes("Card") ? getLogo(balance.service) : null,
      })),
  });
};
