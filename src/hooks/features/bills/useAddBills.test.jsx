import { act, renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { useAddBills } from "./useAddBills";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createNotification } from "../../../api/notification";
import { supabase } from "../../../lib/supabaseClient";
import { formatShortMonth } from "../../../utils/formatDate";

vi.mock("../../../context/AuthContext");

vi.mock("../../../context/ModalContext");

vi.mock("../../../utils/formatDate", () => ({
  formatShortMonth: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../../api/notification", () => ({
  createNotification: vi.fn(),
}));

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const closeModal = vi.fn();

const setModalState = vi.fn();

describe("useAddBills", () => {
  const bill = {
    due_date: "11/18/26",
    amount: 100,
  };

  let insertMock;

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

    insertMock = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(supabase.from).mockReturnValue({ insert: insertMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });

    vi.mocked(useModal).mockReturnValue({
      closeModal,
      setModalState,
    });
  });

  it("inserts a bill with the user's ID", async () => {
    const { result } = renderHook(() => useAddBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(bill);
    });

    expect(supabase.from).toHaveBeenCalledWith("bills");

    expect(insertMock).toHaveBeenCalledWith({
      ...bill,
      user_id: "1",
    });
  });

  it("sets the modal loading state when the mutation starts", async () => {
    const { result } = renderHook(() => useAddBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(bill);
    });

    expect(setModalState).toHaveBeenCalledWith({ isLoading: true });
  });

  it("shows a success toast and creates a notification on success", async () => {
    const { result } = renderHook(() => useAddBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(bill);
    });

    expect(toast.success).toHaveBeenCalledTimes(1);

    expect(formatShortMonth).toHaveBeenCalledWith(bill.due_date);

    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "1" }),
    );
  });

  it("shows an error toast on error", async () => {
    insertMock.mockResolvedValue({
      error: { message: "database error" },
    });

    const { result } = renderHook(() => useAddBills(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(bill)).rejects.toThrow(
        "database",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal when the mutation settles", async () => {
    const { result } = renderHook(() => useAddBills(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(bill);
    });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
