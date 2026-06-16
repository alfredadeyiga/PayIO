import { supabase } from "../lib/supabaseClient";

export async function signup({ email, password, firstName, lastName }) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) throw error;
}

export async function login({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function sendResetLink(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });

  if (error) throw error;
}

export async function updateCurrentPassword({ password, currentPassword }) {
  const { error } = await supabase.auth.updateUser({
    password,
    current_password: currentPassword,
  });

  if (error) throw error;
}

export async function updateEmail(email) {
  const { error } = await supabase.auth.updateUser(
    { email },
    {
      emailRedirectTo: `${window.location.origin}/dashboard/settings?tab=account`,
    },
  );
  if (error) throw error;
}

export async function googleSignIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/dashboard/overview` },
  });

  if (error) throw error;
}
