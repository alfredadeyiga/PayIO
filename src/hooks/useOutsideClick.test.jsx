import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import useOutsideClick from "./useOutsideClick";
import userEvent from "@testing-library/user-event";

const TestComponent = ({ callback }) => {
  const ref = useRef(null);

  useOutsideClick(ref, callback);

  return (
    <div>
      <div data-testid="outside">Outside element</div>

      <div ref={ref} data-testid="inside">
        Inside element
      </div>
    </div>
  );
};

describe("useOutsideClick", () => {
  test("calls callback when clicking outside the referenced element", async () => {
    const user = userEvent.setup();

    const callback = vi.fn();

    render(<TestComponent callback={callback} />);

    await user.click(screen.getByTestId("outside"));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("does not call callback when clicking inside the referenced element", async () => {
    const user = userEvent.setup();

    const callback = vi.fn();

    render(<TestComponent callback={callback} />);

    await user.click(screen.getByTestId("inside"));

    expect(callback).not.toHaveBeenCalled();
  });

  test("calls callback when Escape is pressed", async () => {
    const user = userEvent.setup();

    const callback = vi.fn();

    render(<TestComponent callback={callback} />);

    await user.keyboard("{Escape}");

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("removes event listeners when unmounted", async () => {
    const user = userEvent.setup();

    const callback = vi.fn();

    const { unmount } = render(<TestComponent callback={callback} />);

    unmount();

    await user.keyboard("{Escape}");

    expect(callback).not.toHaveBeenCalled();
  });
});
