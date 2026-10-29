import { act, renderHook } from "@testing-library/react";
import { useModal } from "../../../context/ModalContext";
import { useUpdateBalance } from "./useUpdateBalance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/ModalContext");

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const closeModal = vi.fn();

const setModalState = vi.fn();

describe("useUpdateBalance", () => {
  const balance = {
    id: "1",
    total: 100,
  };

  let updateMock;
  let eqMock;
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

    eqMock = vi.fn().mockResolvedValue({ error: null });

    updateMock = vi.fn().mockReturnValue({ eq: eqMock });

    vi.mocked(supabase.from).mockReturnValue({ update: updateMock });

    vi.mocked(useModal).mockReturnValue({
      closeModal,
      setModalState,
    });
  });

  it("updates a balance with its ID", async () => {
    const { result } = renderHook(() => useUpdateBalance(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(balance);
    });

    expect(supabase.from).toHaveBeenCalledWith("balances");

    expect(updateMock).toHaveBeenCalledWith({ total: balance.total });

    expect(eqMock).toHaveBeenCalledWith("id", balance.id);
  });

  it("sets the modal loading state when the mutation starts", async () => {
    const { result } = renderHook(() => useUpdateBalance(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(balance);
    });

    expect(setModalState).toHaveBeenCalledWith({ isLoading: true });
  });

  it("calls closeModal and shows an error toast on error", async () => {
    eqMock.mockResolvedValue({ error: { message: "database error" } });

    const { result } = renderHook(() => useUpdateBalance(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(balance)).rejects.toThrow(
        "database",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
