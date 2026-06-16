import { useRealtimeTable } from "../hooks/useRealtimeTable";

function RealtimeProvider({ children }) {
  useRealtimeTable({
    table: "transactions",
  });

  useRealtimeTable({
    table: "bills",
    sortFn: (data) =>
      data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)),
  });

  useRealtimeTable({
    table: "notifications",
  });

  useRealtimeTable({
    table: "goals",
  });

  useRealtimeTable({
    table: "balances",
  });

  return children;
}

export default RealtimeProvider;
