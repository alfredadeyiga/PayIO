import { renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "./useNotifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/AuthContext");

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("useNotifications", () => {
  const notifications = [{ id: "1", message: "New balance added" }];

  let selectMock;
  let eqMock;
  let orderMock;
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

    orderMock = vi.fn().mockResolvedValue({ data: notifications, error: null });

    eqMock = vi.fn().mockReturnValue({ order: orderMock });

    selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    vi.mocked(supabase.from).mockReturnValue({ select: selectMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });
  });

  it("selects notifications with the user's ID", () => {
    renderHook(() => useNotifications(), { wrapper });

    expect(supabase.from).toHaveBeenCalledWith("notifications");

    expect(selectMock).toHaveBeenCalledWith("*");

    expect(eqMock).toHaveBeenCalledWith("user_id", "1");
  });

  it("sets enabled to true when there is a user ID", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    expect(result.current.isEnabled).toBe(true);
  });
});
