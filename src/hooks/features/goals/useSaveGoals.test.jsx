import { act, renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { useSaveGoals } from "./useSaveGoals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createNotification } from "../../../api/notification";
import { supabase } from "../../../lib/supabaseClient";

vi.mock("../../../context/AuthContext");

vi.mock("../../../context/ModalContext");

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

describe("useSaveGoals", () => {
  const goal = { target: 500, achieved: 100 };

  let upsertMock;

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

    upsertMock = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(supabase.from).mockReturnValue({ upsert: upsertMock });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });

    vi.mocked(useModal).mockReturnValue({
      closeModal,
      setModalState,
    });
  });

  it("upserts a goal with the user's ID", async () => {
    const { result } = renderHook(() => useSaveGoals(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(goal);
    });

    expect(supabase.from).toHaveBeenCalledWith("goals");

    expect(upsertMock).toHaveBeenCalledWith(
      {
        ...goal,
        user_id: "1",
      },
      { onConflict: "user_id,period" },
    );
  });

  it("sets the modal loading state when the mutation starts", async () => {
    const { result } = renderHook(() => useSaveGoals(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(goal);
    });

    expect(setModalState).toHaveBeenCalledWith({ isLoading: true });
  });

  it("shows a success toast and creates a notification on success", async () => {
    const { result } = renderHook(() => useSaveGoals(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(goal);
    });

    expect(toast.success).toHaveBeenCalledTimes(1);

    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "1" }),
    );
  });

  it("shows an error toast on error", async () => {
    upsertMock.mockResolvedValue({
      error: { message: "database error" },
    });

    const { result } = renderHook(() => useSaveGoals(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(goal)).rejects.toThrow(
        "database",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal when the mutation settles", async () => {
    const { result } = renderHook(() => useSaveGoals(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(goal);
    });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
