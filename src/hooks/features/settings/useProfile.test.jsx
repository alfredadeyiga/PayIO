import { renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useProfile } from "./useProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/AuthContext");

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("useProfile", () => {
  const profile = { id: "1" };

  let selectMock;
  let eqMock;
  let singleMock;
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

    singleMock = vi.fn().mockResolvedValue({ data: profile, error: null });

    eqMock = vi.fn().mockReturnValue({ single: singleMock });

    selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    vi.mocked(supabase.from).mockReturnValue({ select: selectMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });
  });

  it("selects profile with the user's ID", () => {
    renderHook(() => useProfile(), { wrapper });

    expect(supabase.from).toHaveBeenCalledWith("profiles");

    expect(selectMock).toHaveBeenCalledWith("*");

    expect(eqMock).toHaveBeenCalledWith("id", "1");

    expect(singleMock).toHaveBeenCalled();
  });

  it("sets enabled to true when there is a user ID", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    expect(result.current.isEnabled).toBe(true);
  });
});
