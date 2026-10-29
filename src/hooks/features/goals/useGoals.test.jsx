import { renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useGoals } from "./useGoals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/AuthContext");

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("useGoals", () => {
  const goals = [
    { period: "September 2026", target: 1000 },
    { period: "October 2026", target: 100 },
  ];

  let selectMock;
  let eqMock;
  let limitMock;
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

    limitMock = vi.fn().mockResolvedValue({ data: goals, error: null });

    eqMock = vi.fn().mockReturnValue({ limit: limitMock });

    selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    vi.mocked(supabase.from).mockReturnValue({ select: selectMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });
  });

  it("selects goals with the user's ID", () => {
    renderHook(() => useGoals(), { wrapper });

    expect(supabase.from).toHaveBeenCalledWith("goals");

    expect(selectMock).toHaveBeenCalledWith("*");

    expect(eqMock).toHaveBeenCalledWith("user_id", "1");
  });

  it("sets enabled to true when there is a user ID", () => {
    const { result } = renderHook(() => useGoals(), { wrapper });

    expect(result.current.isEnabled).toBe(true);
  });
});
