import {
  googleSignIn,
  login,
  logout,
  signup,
  updateCurrentPassword,
  updateEmail,
  updatePassword,
} from "./auth";

const { signupMock } = vi.hoisted(() => ({
  signupMock: vi.fn().mockResolvedValue({ error: null }),
}));

const { loginMock } = vi.hoisted(() => ({
  loginMock: vi.fn().mockResolvedValue({ error: null }),
}));

const { logoutMock } = vi.hoisted(() => ({
  logoutMock: vi.fn().mockResolvedValue({ error: null }),
}));

const { updateMock } = vi.hoisted(() => ({
  updateMock: vi.fn().mockResolvedValue({ error: null }),
}));

const { googleMock } = vi.hoisted(() => ({
  googleMock: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: signupMock,
      signInWithPassword: loginMock,
      signOut: logoutMock,
      updateUser: updateMock,
      signInWithOAuth: googleMock,
    },
  },
}));

describe("auth", () => {
  const user = {
    email: "user@test.com",
    password: "1234",
    firstName: "User",
    lastName: "Test",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    signupMock.mockResolvedValue({ error: null });
    loginMock.mockResolvedValue({ error: null });
    logoutMock.mockResolvedValue({ error: null });
    updateMock.mockResolvedValue({ error: null });
    googleMock.mockResolvedValue({ error: null });
  });

  describe("signup", () => {
    it("creates an authenticated user", async () => {
      await signup(user);

      expect(signupMock).toHaveBeenCalledWith({
        email: user.email,
        password: user.password,
        options: {
          data: {
            first_name: user.firstName,
            last_name: user.lastName,
          },
        },
      });
    });

    it("throws an error on error", async () => {
      signupMock.mockResolvedValue({ error: "Network Error" });

      await expect(signup(user)).rejects.toThrow("Network Error");
    });
  });

  describe("login", () => {
    it("signs in an authenticated user", async () => {
      await login({ email: user.email, password: user.password });

      expect(loginMock).toHaveBeenCalledWith({
        email: user.email,
        password: user.password,
      });
    });

    it("throws an error on error", async () => {
      loginMock.mockResolvedValue({ error: "Network Error" });

      await expect(
        login({ email: user.email, password: user.password }),
      ).rejects.toThrow("Network Error");
    });
  });

  describe("logout", () => {
    it("signs out an authenticated user", async () => {
      await logout();

      expect(logoutMock).toHaveBeenCalledTimes(1);
    });

    it("throws an error on error", async () => {
      logoutMock.mockResolvedValue({ error: "Network Error" });

      await expect(logout()).rejects.toThrow("Network Error");
    });
  });

  describe("updatePassword", () => {
    it("updates authenticated user's password", async () => {
      await updatePassword(user.password);

      expect(updateMock).toHaveBeenCalledWith({ password: user.password });
    });

    it("throws an error on error", async () => {
      updateMock.mockResolvedValue({ error: "Network Error" });

      await expect(updatePassword(user.password)).rejects.toThrow(
        "Network Error",
      );
    });
  });

  describe("updateCurrentPassword", () => {
    it("updates authenticated user's current password", async () => {
      await updateCurrentPassword({
        password: user.password,
        currentPassword: "123",
      });

      expect(updateMock).toHaveBeenCalledWith({
        password: user.password,
        current_password: "123",
      });
    });

    it("throws an error on error", async () => {
      updateMock.mockResolvedValue({ error: "Network Error" });

      await expect(
        updateCurrentPassword({
          password: user.password,
          currentPassword: "123",
        }),
      ).rejects.toThrow("Network Error");
    });
  });

  describe("updateEmail", () => {
    it("updates authenticated user's email", async () => {
      await updateEmail(user.email);

      expect(updateMock).toHaveBeenCalledWith(
        { email: user.email },
        { emailRedirectTo: expect.any(String) },
      );
    });

    it("throws an error on error", async () => {
      updateMock.mockResolvedValue({ error: "Network Error" });

      await expect(updateEmail(user.email)).rejects.toThrow("Network Error");
    });
  });

  describe("googleSignIn", () => {
    it("signs in an authenticated user with google oauth", async () => {
      await googleSignIn();

      expect(googleMock).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: expect.any(String) },
      });
    });

    it("throws an error on error", async () => {
      googleMock.mockResolvedValue({ error: "Network Error" });

      await expect(googleSignIn()).rejects.toThrow("Network Error");
    });
  });
});
