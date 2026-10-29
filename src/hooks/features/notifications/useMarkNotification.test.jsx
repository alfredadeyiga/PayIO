import { act, renderHook } from "@testing-library/react";
import { useModal } from "../../../context/ModalContext";
import { useMarkNotification } from "./useMarkNotification";
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

describe("useMarkNotification", () => {
  const notificationId = "1";

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

  it("updates a notification with the user's ID", async () => {
    const { result } = renderHook(() => useMarkNotification(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(notificationId);
    });

    expect(supabase.from).toHaveBeenCalledWith("notifications");

    expect(updateMock).toHaveBeenCalledWith({ is_read: true });

    expect(eqMock).toHaveBeenCalledWith("id", notificationId);
  });

  it("shows an error toast on error", async () => {
    eqMock.mockResolvedValue({ error: { message: "database error" } });

    const { result } = renderHook(() => useMarkNotification(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(notificationId)).rejects.toThrow(
        "database",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});
