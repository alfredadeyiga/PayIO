import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const useProfile = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
  });
};
