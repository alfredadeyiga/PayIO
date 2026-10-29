import { act, renderHook } from "@testing-library/react";
import { useModal } from "../../../context/ModalContext";
import { useUpdateBills } from "./useUpdateBills";
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

describe("useUpdateBills", () => {
  const bill = {
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

  it("updates a bill with its ID", async () => {
    const { result } = renderHook(() => useUpdateBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(bill);
    });

    expect(supabase.from).toHaveBeenCalledWith("bills");

    expect(updateMock).toHaveBeenCalledWith(bill.updates);

    expect(eqMock).toHaveBeenCalledWith("id", bill.id);
  });

  it("sets the modal loading state when the mutation starts", async () => {
    const { result } = renderHook(() => useUpdateBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(bill);
    });

    expect(setModalState).toHaveBeenCalledWith({ isLoading: true });
  });

  it("shows a success toast on success", async () => {
    const { result } = renderHook(() => useUpdateBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(bill);
    });

    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("shows an error toast on error", async () => {
    eqMock.mockResolvedValue({ error: { message: "database error" } });

    const { result } = renderHook(() => useUpdateBills(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(bill)).rejects.toThrow(
        "database",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal when the mutation settles", async () => {
    const { result } = renderHook(() => useUpdateBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(bill);
    });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
