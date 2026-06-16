import { supabase } from "../lib/supabaseClient";

export async function uploadAvatar(file, userId) {
  const fileName = `${userId}/avatar-${Date.now()}.${file.name}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
