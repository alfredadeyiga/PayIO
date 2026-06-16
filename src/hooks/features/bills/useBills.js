import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { getLogo } from "../../../utils/getLogo";

const fetchBills = async (userId) => {
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true });

  if (error) throw error;
  return data;
};

export const useBills = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ["bills", userId],
    queryFn: () => fetchBills(userId),
    enabled: !!userId,
    select: (data) =>
      data.map((bill) => ({
        ...bill,
        logo: getLogo(bill.bill_name),
      })),
  });
};
