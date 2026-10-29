import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useBills } from "./useBills";
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

describe("useBills", () => {
  const bills = [
    { bill_name: "Insurance", amount: 1000 },
    { bill_name: "Food", amount: 100 },
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

    orderMock = vi.fn().mockResolvedValue({ data: bills, error: null });

    eqMock = vi.fn().mockReturnValue({ order: orderMock });

    selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    vi.mocked(supabase.from).mockReturnValue({ select: selectMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });
  });

  it("selects bills with the user's ID", () => {
    renderHook(() => useBills(), { wrapper });

    expect(supabase.from).toHaveBeenCalledWith("bills");

    expect(selectMock).toHaveBeenCalledWith("*");

    expect(eqMock).toHaveBeenCalledWith("user_id", "1");
  });

  it("sets enabled to true when there is a user ID", () => {
    const { result } = renderHook(() => useBills(), { wrapper });

    expect(result.current.isEnabled).toBe(true);
  });

  it("calls getLogo for each bill name", async () => {
    renderHook(() => useBills(), { wrapper });

    await waitFor(() => {
      expect(getLogo).toHaveBeenCalledWith(bills[0].bill_name);

      expect(getLogo).toHaveBeenCalledWith(bills[1].bill_name);
    });
  });
});
