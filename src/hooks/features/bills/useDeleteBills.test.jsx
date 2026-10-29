import { act, renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { useDeleteBills } from "./useDeleteBills";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/AuthContext");

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

describe("useDeleteBills", () => {
  const billId = "1";

  let deleteMock;
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

    deleteMock = vi.fn().mockReturnValue({ eq: eqMock });

    vi.mocked(supabase.from).mockReturnValue({ delete: deleteMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });

    vi.mocked(useModal).mockReturnValue({
      closeModal,
      setModalState,
    });
  });

  it("deletes a balance with its ID", async () => {
    const { result } = renderHook(() => useDeleteBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(billId);
    });

    expect(supabase.from).toHaveBeenCalledWith("bills");

    expect(deleteMock).toHaveBeenCalledTimes(1);

    expect(eqMock).toHaveBeenCalledWith("id", billId);
  });

  it("sets the modal loading state when the mutation starts", async () => {
    const { result } = renderHook(() => useDeleteBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(billId);
    });

    expect(setModalState).toHaveBeenCalledWith({ isLoading: true });
  });

  it("shows a success toast on success", async () => {
    const { result } = renderHook(() => useDeleteBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(billId);
    });

    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("shows an error toast on error", async () => {
    eqMock.mockResolvedValue({
      error: { message: "database error" },
    });

    const { result } = renderHook(() => useDeleteBills(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(billId)).rejects.toThrow(
        "database",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal when the mutation settles", async () => {
    const { result } = renderHook(() => useDeleteBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(billId);
    });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
