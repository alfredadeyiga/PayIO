import { act, renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { useAddBalance } from "./useAddBalance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { formatAccountNumber } from "../../../utils/formatAccountNumber";
import { formatCapitalize } from "../../../utils/formatCapitalize";
import { createNotification } from "../../../api/notification";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/AuthContext");

vi.mock("../../../context/ModalContext");

vi.mock("../../../utils/formatAccountNumber");

vi.mock("../../../utils/formatCapitalize");

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

describe("useAddBalance", () => {
  const balance = {
    type: "bank",
    account_number: "1234567890",
    total: 100,
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

  it("inserts a balance with the user's ID", async () => {
    const { result } = renderHook(() => useAddBalance(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(balance);
    });

    expect(supabase.from).toHaveBeenCalledWith("balances");

    expect(insertMock).toHaveBeenCalledWith({
      ...balance,
      user_id: "1",
    });
  });

  it("sets the modal loading state when the mutation starts", async () => {
    const { result } = renderHook(() => useAddBalance(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(balance);
    });

    expect(setModalState).toHaveBeenCalledWith({ isLoading: true });
  });

  it("shows a success toast and creates a notification on success", async () => {
    const { result } = renderHook(() => useAddBalance(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(balance);
    });

    expect(toast.success).toHaveBeenCalledTimes(1);

    expect(formatAccountNumber).toHaveBeenCalledWith(balance.account_number, {
      type: balance.type,
    });

    expect(formatCapitalize).toHaveBeenCalledWith(balance.type);

    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "1" }),
    );
  });

  it("shows an error toast on error", async () => {
    insertMock.mockResolvedValue({
      error: { message: "duplicate key value violates unique constraint" },
    });

    const { result } = renderHook(() => useAddBalance(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(balance)).rejects.toThrow(
        "duplicate",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal when the mutation settles", async () => {
    const { result } = renderHook(() => useAddBalance(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(balance);
    });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
