import { act, renderHook } from "@testing-library/react";
import { useAuth } from "../../../context/AuthContext";
import { useUpdateProfile } from "./useUpdateProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createNotification } from "../../../api/notification";
import { supabase } from "../../../lib/supabaseClient";
import { formatCapitalize } from "../../../utils/formatCapitalize";

vi.mock("../../../context/AuthContext");

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

describe("useUpdateProfile", () => {
  const profile = { id: "1", first_name: "User" };

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

    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
    });
  });

  it("updates a profile with the user's ID", async () => {
    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(profile);
    });

    expect(supabase.from).toHaveBeenCalledWith("profiles");

    expect(updateMock).toHaveBeenCalledWith(profile);

    expect(eqMock).toHaveBeenCalledWith("id", profile.id);
  });

  it("shows a success toast and creates a notification on success", async () => {
    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(profile);
    });

    expect(toast.success).toHaveBeenCalledTimes(1);

    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "1" }),
    );
  });

  it("shows an error toast on error", async () => {
    eqMock.mockResolvedValue({
      error: { message: "database error" },
    });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(profile)).rejects.toThrow(
        "database",
      );
    });

    expect(toast.error).toHaveBeenCalledTimes(1);

    expect(formatCapitalize).toHaveBeenCalledWith("database error");
  });
});
