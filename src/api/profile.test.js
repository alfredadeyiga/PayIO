import { supabase } from "../lib/supabaseClient";
import { uploadAvatar } from "./profile";

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    storage: {
      from: vi.fn(),
    },
  },
}));

describe("uploadAvatar", () => {
  const avatar = {
    userId: "1",
    file: { name: "avatar.png" },
  };

  let uploadMock;

  let urlMock;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.useRealTimers();

    uploadMock = vi.fn().mockResolvedValue({ error: null });

    urlMock = vi
      .fn()
      .mockReturnValue({ data: { publicUrl: "avatars/test.png" } });

    vi.mocked(supabase.storage.from).mockReturnValue({
      upload: uploadMock,
      getPublicUrl: urlMock,
    });
  });

  it("creates an avatar and returns a public url", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8));

    const result = await uploadAvatar(avatar.file, avatar.userId);

    expect(supabase.storage.from).toHaveBeenCalledWith("avatars");

    expect(supabase.storage.from).toHaveBeenCalledTimes(2);

    expect(uploadMock).toHaveBeenCalledWith(
      `1/avatar-${Date.now()}.avatar.png`,
      avatar.file,
    );

    expect(urlMock).toHaveBeenCalledWith(`1/avatar-${Date.now()}.avatar.png`);

    expect(result).toBe("avatars/test.png");
  });

  it("throws an error on error", async () => {
    uploadMock.mockResolvedValue({ error: "Network Error" });

    await expect(uploadAvatar(avatar.file, avatar.userId)).rejects.toThrow(
      "Network Error",
    );
  });
});
