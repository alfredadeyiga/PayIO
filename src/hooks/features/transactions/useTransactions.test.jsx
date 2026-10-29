import { renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useTransactions } from "./useTransactions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/AuthContext");

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("useTransactions", () => {
  const transactions = [
    { item_name: "Insurance", amount: 1000 },
    { item_name: "Food", amount: 100 },
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

    orderMock = vi.fn().mockResolvedValue({ data: transactions, error: null });

    eqMock = vi.fn().mockReturnValue({ order: orderMock });

    selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    vi.mocked(supabase.from).mockReturnValue({ select: selectMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });
  });

  it("selects transactions with the user's ID", () => {
    renderHook(() => useTransactions(), { wrapper });

    expect(supabase.from).toHaveBeenCalledWith("transactions");

    expect(selectMock).toHaveBeenCalledWith("*");

    expect(eqMock).toHaveBeenCalledWith("user_id", "1");
  });

  it("sets enabled to true when there is a user ID", () => {
    const { result } = renderHook(() => useTransactions(), { wrapper });

    expect(result.current.isEnabled).toBe(true);
  });
});
