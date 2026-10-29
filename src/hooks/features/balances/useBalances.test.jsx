import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useBalances } from "./useBalances";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { getLogo } from "../../../utils/getLogo";

vi.mock("../../../context/AuthContext");

vi.mock("../../../utils/getLogo");

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("useBalances", () => {
  const balances = [
    { type: "Credit Card", total: 1000, service: "VISA" },
    { type: "Savings", total: 1000, service: "Chase" },
  ];

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

    orderMock = vi.fn().mockResolvedValue({ data: balances, error: null });

    eqMock = vi.fn().mockReturnValue({ order: orderMock });

    selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    vi.mocked(supabase.from).mockReturnValue({ select: selectMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });
  });

  it("selects balances with the user's ID", () => {
    renderHook(() => useBalances(), { wrapper });

    expect(supabase.from).toHaveBeenCalledWith("balances");

    expect(selectMock).toHaveBeenCalledWith("*");

    expect(eqMock).toHaveBeenCalledWith("user_id", "1");
  });

  it("sets enabled to true when there is a user ID", () => {
    const { result } = renderHook(() => useBalances(), { wrapper });

    expect(result.current.isEnabled).toBe(true);
  });

  it("calls getLogo when balance type includes card", async () => {
    renderHook(() => useBalances(), { wrapper });

    await waitFor(() => {
      expect(getLogo).toHaveBeenCalledWith(balances[0].service);
    });
  });

  it("does not call getLogo when balance type is not card", async () => {
    renderHook(() => useBalances(), { wrapper });

    await waitFor(() => {
      expect(getLogo).not.toHaveBeenCalledWith(balances[1].service);
    });
  });
});
