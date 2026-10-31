import { supabase } from "../lib/supabaseClient";
import { createNotification } from "./notification";

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("createNotification", () => {
  const notification = {
    userId: "1",
    message: "New balance added",
    description: "A new balance has been created",
  };

  let insertMock;

  beforeEach(() => {
    vi.clearAllMocks();

    insertMock = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(supabase.from).mockReturnValue({ insert: insertMock });
  });

  it("creates a notification with the user's ID", async () => {
    await createNotification(notification);

    expect(supabase.from).toHaveBeenCalledWith("notifications");

    expect(insertMock).toHaveBeenCalledWith({
      user_id: notification.userId,
      message: notification.message,
      description: notification.description,
    });
  });

  it("throws an error on error", async () => {
    insertMock.mockResolvedValue({ error: "Network Error" });

    await expect(createNotification(notification)).rejects.toThrow(
      "Network Error",
    );
  });
});
