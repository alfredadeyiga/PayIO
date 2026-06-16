import { supabase } from "../lib/supabaseClient";

export async function createNotification({ userId, message, description }) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    message,
    description,
  });

  if (error) throw error;
}