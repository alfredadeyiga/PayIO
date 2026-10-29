import { act, renderHook } from "@testing-library/react";
import { useModal } from "../../../context/ModalContext";
import { useUpdateTransaction } from "./useUpdateTransaction";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/ModalContext");

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const closeModal = vi.fn();

const setModalState = vi.fn();

describe("useUpdateTransaction", () => {
  const transaction = {
    id: "1",
    updates: { amount: 100 },
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

  it("updates a transaction with its ID", async () => {
    const { result } = renderHook(() => useUpdateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(transaction);
    });

    expect(supabase.from).toHaveBeenCalledWith("transactions");

    expect(updateMock).toHaveBeenCalledWith(transaction.updates);

    expect(eqMock).toHaveBeenCalledWith("id", transaction.id);
  });

  it("sets the modal loading state when the mutation starts", async () => {
    const { result } = renderHook(() => useUpdateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(transaction);
    });

    expect(setModalState).toHaveBeenCalledWith({ isLoading: true });
  });

  it("shows a success toast on success", async () => {
    const { result } = renderHook(() => useUpdateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(transaction);
    });

    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("shows an error toast on error", async () => {
    eqMock.mockResolvedValue({ error: { message: "database error" } });

    const { result } = renderHook(() => useUpdateTransaction(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(transaction)).rejects.toThrow(
        "database",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal when the mutation settles", async () => {
    const { result } = renderHook(() => useUpdateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(transaction);
    });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
