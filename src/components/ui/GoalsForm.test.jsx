import { toast } from "react-toastify";
import { useGoals } from "../../hooks/features/goals/useGoals";
import { useSaveGoals } from "../../hooks/features/goals/useSaveGoals";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test/test-utils";
import GoalsForm from "./GoalsForm";
import { useModal } from "../../context/ModalContext";
import { getCurrentPeriod } from "../../utils/formatDate";

vi.mock("../../hooks/features/goals/useGoals");

vi.mock("../../hooks/features/goals/useSaveGoals");

vi.mock("../../context/ModalContext");

vi.mock("react-toastify", () => ({
  toast: { info: vi.fn() },
}));

const mutate = vi.fn();

describe("GoalsForm", () => {
  const mockGoals = [
    { period: getCurrentPeriod(), achieved: 2000, target: 5000 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useGoals).mockReturnValue({
      data: [],
    });

    vi.mocked(useSaveGoals).mockReturnValue({
      mutate,
    });

    vi.mocked(useModal).mockReturnValue({
      isLoading: false,
    });
  });

  it("renders default fields", () => {
    render(<GoalsForm />);

    const targetAchieved = screen.getByLabelText(/achieved/i);
    expect(targetAchieved).toBeInTheDocument();

    const monthTarget = screen.getByLabelText(/month/i);
    expect(monthTarget).toBeInTheDocument();
  });

  it("renders placeholders with current goal when updating goals", () => {
    vi.mocked(useGoals).mockReturnValue({
      data: mockGoals,
    });

    render(<GoalsForm />);

    const achievedPlaceholder = screen.getByPlaceholderText(/\$2000/i);
    expect(achievedPlaceholder).toBeInTheDocument();

    const monthPlaceholder = screen.getByPlaceholderText(/\$5000/i);
    expect(monthPlaceholder).toBeInTheDocument();
  });

  it("requires both fields when no current goal exists", () => {
    render(<GoalsForm />);

    const targetAchieved = screen.getByLabelText(/achieved/i);
    expect(targetAchieved).toBeRequired();

    const monthTarget = screen.getByLabelText(/month/i);
    expect(monthTarget).toBeRequired();
  });

  it("adds a new goal", async () => {
    const user = userEvent.setup();

    render(<GoalsForm />);

    const targetAchieved = screen.getByLabelText(/achieved/i);
    await user.type(targetAchieved, "2000");

    const monthTarget = screen.getByLabelText(/month/i);
    await user.type(monthTarget, "5000");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(mutate).toHaveBeenCalledWith({
      achieved: 2000,
      target: 5000,
      period: getCurrentPeriod(),
    });
  });

  it("updates the current goal", async () => {
    vi.mocked(useGoals).mockReturnValue({
      data: mockGoals,
    });

    const user = userEvent.setup();

    render(<GoalsForm />);

    const targetAchieved = screen.getByLabelText(/achieved/i);
    await user.type(targetAchieved, "3000");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(mutate).toHaveBeenCalledWith({
      achieved: 3000,
      target: 5000,
      period: getCurrentPeriod(),
    });
  });

  it("shows a toast info when no changes to the current goal", async () => {
    vi.mocked(useGoals).mockReturnValue({
      data: mockGoals,
    });

    const user = userEvent.setup();

    render(<GoalsForm />);

    const targetAchieved = screen.getByLabelText(/achieved/i);
    await user.type(targetAchieved, "2000");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    expect(toast.info).toHaveBeenCalledTimes(1);

    expect(mutate).not.toHaveBeenCalled();
  });
});
