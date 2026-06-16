import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

export const useRealtimeTable = ({ table, sortFn }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(table)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.setQueryData([table, userId], (prev = []) => {
            switch (payload.eventType) {
              case "INSERT":
                return sortFn
                  ? sortFn([payload.new, ...prev])
                  : [payload.new, ...prev];

              case "UPDATE":
                return prev.map((item) =>
                  item.id === payload.new.id ? payload.new : item,
                );

              default:
                return prev;
            }
          });
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, queryClient, table, sortFn]);
};
