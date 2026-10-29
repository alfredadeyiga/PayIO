import { act, fireEvent, render, screen } from "@testing-library/react";
import { toast } from "react-toastify";
import { createNotification } from "../api/notification";
import { AuthProvider, useAuth } from "./AuthContext";

const { getUser, onAuthStateChange, unsubscribe, toastSuccess, authCallback } =
  vi.hoisted(() => ({
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
    unsubscribe: vi.fn(),
    toastSuccess: vi.fn(),
    authCallback: { current: null },
  }));

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser,
      onAuthStateChange,
    },
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: toastSuccess,
  },
}));

vi.mock("../api/notification", () => ({
  createNotification: vi.fn(),
}));

function AuthProbe() {
  const { user, loading, setLoading } = useAuth();

  return (
    <>
      <output data-testid="user">{user?.email ?? "signed out"}</output>
      <output data-testid="loading">{String(loading)}</output>
      <button onClick={() => setLoading(true)}>Set loading</button>
    </>
  );
}

async function renderAuthProvider() {
  const result = render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
  );

  await act(async () => {
    await Promise.resolve();
  });

  return result;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authCallback.current = null;
    getUser.mockResolvedValue({ data: { user: null } });
    onAuthStateChange.mockImplementation((callback) => {
      authCallback.current = callback;
      return { data: { subscription: { unsubscribe } } };
    });
  });

  it("loads the current user and exposes the loading setter", async () => {
    getUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "person@example.com" } },
    });

    await renderAuthProvider();

    expect(getUser).toHaveBeenCalledOnce();
    expect(onAuthStateChange).toHaveBeenCalledOnce();
    expect(screen.getByTestId("user")).toHaveTextContent("person@example.com");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");

    fireEvent.click(screen.getByRole("button", { name: "Set loading" }));

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("updates the user when auth state changes", async () => {
    await renderAuthProvider();

    act(() => {
      authCallback.current("SIGNED_IN", {
        user: { id: "user-1", email: "person@example.com" },
      });
    });

    expect(screen.getByTestId("user")).toHaveTextContent("person@example.com");

    act(() => {
      authCallback.current("SIGNED_OUT", null);
    });

    expect(screen.getByTestId("user")).toHaveTextContent("signed out");
  });

  it("notifies when the signed-in user's email is updated", async () => {
    await renderAuthProvider();
    const user = { id: "user-1", email: "new@example.com" };

    act(() => {
      authCallback.current("SIGNED_IN", {
        user: { id: user.id, email: "old@example.com" },
      });
    });
    act(() => {
      authCallback.current("USER_UPDATED", { user });
    });

    expect(toast.success).toHaveBeenCalledWith("Your profile has been updated");
    expect(createNotification).toHaveBeenCalledWith({
      userId: "user-1",
      message: "Your account has been updated",
      description: "Your email address was updated successfully",
    });
  });

  it("does not notify for an unchanged email or an update without a prior user", async () => {
    await renderAuthProvider();
    const user = { id: "user-1", email: "person@example.com" };

    act(() => {
      authCallback.current("USER_UPDATED", { user });
    });
    act(() => {
      authCallback.current("SIGNED_IN", { user });
    });
    act(() => {
      authCallback.current("USER_UPDATED", { user });
    });

    expect(toast.success).not.toHaveBeenCalled();
    expect(createNotification).not.toHaveBeenCalled();
  });

  it("unsubscribes from auth state changes on unmount", async () => {
    const { unmount } = await renderAuthProvider();

    unmount();

    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
