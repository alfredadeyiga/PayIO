import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useRealtimeTable } from "./useRealtimeTable";

vi.mock("../context/AuthContext");

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
}));

describe("useRealtimeTable", () => {
  let onMock;
  let subscribeMock;
  let queryClient;

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    subscribeMock = vi.fn();

    onMock = vi.fn().mockReturnValue({
      subscribe: subscribeMock,
    });

    vi.mocked(supabase.channel).mockReturnValue({ on: onMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });
  });

  it("does not subscribe when there is no authenticated user", () => {
    vi.mocked(useAuth).mockReturnValue({ user: null });

    renderHook(() => useRealtimeTable({ table: "transactions" }), {
      wrapper,
    });

    expect(supabase.channel).not.toHaveBeenCalled();
  });

  it("subscribes to the specified table for the authenticated user", () => {
    renderHook(() => useRealtimeTable({ table: "transactions" }), {
      wrapper,
    });

    expect(supabase.channel).toHaveBeenCalledWith("transactions");

    expect(onMock).toHaveBeenCalledWith(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "transactions",
        filter: "user_id=eq.1",
      },
      expect.any(Function),
    );

    expect(subscribeMock).toHaveBeenCalled();
  });

  it("removes the channel when unmounted", () => {
    const { unmount } = renderHook(
      () => useRealtimeTable({ table: "transactions" }),
      { wrapper },
    );

    unmount();

    expect(supabase.removeChannel).toHaveBeenCalledTimes(1);
  });
});
