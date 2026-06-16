import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

const fetchNotifications = async (userId) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId,
  });
};
