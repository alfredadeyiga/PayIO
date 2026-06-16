import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import { createNotification } from "../api/notification";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const prevUserRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user || null;
        const prevUser = prevUserRef.current;

        if (event === "USER_UPDATED" && currentUser && prevUser) {
          if (currentUser.email !== prevUser.email) {
            toast.success("Your profile has been updated");

            createNotification({
              userId: currentUser.id,
              message: "Your account has been updated",
              description: "Your email address was updated successfully",
            });
          }
        }

        prevUserRef.current = currentUser;
        setUser(currentUser);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
