import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

const fetchGoals = async (userId) => {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .limit(12);

  if (error) throw error;
  return data;
};

export const useGoals = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ["goals", userId],
    queryFn: () => fetchGoals(userId),
    enabled: !!userId,
  });
};
