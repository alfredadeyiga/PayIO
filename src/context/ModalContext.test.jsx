import { fireEvent, render, screen } from "@testing-library/react";
import { ModalProvider, useModal } from "./ModalContext";

function ModalProbe() {
  const {
    isOpen,
    type,
    title,
    content,
    onConfirm,
    openModal,
    closeModal,
    setModalState,
  } = useModal();

  return (
    <>
      <output data-testid="is-open">{String(isOpen)}</output>
      <output data-testid="type">{type}</output>
      <output data-testid="title">{title}</output>
      <output data-testid="content">{content ?? "no content"}</output>
      <button
        onClick={() =>
          openModal({
            title: "Confirm payment",
            content: "Payment details",
            onConfirm: () => {},
          })
        }
      >
        Open default modal
      </button>
      <button
        onClick={() =>
          openModal({
            type: "confirmation",
            title: "Delete account",
            content: "This cannot be undone",
            onConfirm: () => {},
          })
        }
      >
        Open confirmation modal
      </button>
      <button onClick={closeModal}>Close modal</button>
      <button onClick={() => setModalState({ title: "Updated title" })}>
        Update modal
      </button>
      <button onClick={() => onConfirm?.()}>Confirm</button>
    </>
  );
}

describe("ModalProvider", () => {
  it("starts closed with default form modal values", () => {
    render(
      <ModalProvider>
        <ModalProbe />
      </ModalProvider>,
    );

    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("type")).toHaveTextContent("form");
    expect(screen.getByTestId("title")).toBeEmptyDOMElement();
    expect(screen.getByTestId("content")).toHaveTextContent("no content");
  });

  it("opens a modal and defaults its type to form", () => {
    render(
      <ModalProvider>
        <ModalProbe />
      </ModalProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open default modal" }));

    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
    expect(screen.getByTestId("type")).toHaveTextContent("form");
    expect(screen.getByTestId("title")).toHaveTextContent("Confirm payment");
    expect(screen.getByTestId("content")).toHaveTextContent("Payment details");
  });

  it("uses the supplied modal type and confirmation callback", () => {
    const onConfirm = vi.fn();
    function ConfirmationProbe() {
      const { openModal, onConfirm: confirm } = useModal();

      return (
        <>
          <button
            onClick={() =>
              openModal({
                type: "confirmation",
                title: "Delete account",
                content: "This cannot be undone",
                onConfirm,
              })
            }
          >
            Open confirmation
          </button>
          <button onClick={() => confirm()}>Confirm</button>
          <output>{useModal().type}</output>
        </>
      );
    }

    render(
      <ModalProvider>
        <ConfirmationProbe />
      </ModalProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open confirmation" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(screen.getByText("confirmation")).toBeInTheDocument();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("closes without discarding modal values and merges partial state updates", () => {
    render(
      <ModalProvider>
        <ModalProbe />
      </ModalProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open confirmation modal" }));
    fireEvent.click(screen.getByRole("button", { name: "Update modal" }));

    expect(screen.getByTestId("title")).toHaveTextContent("Updated title");
    expect(screen.getByTestId("type")).toHaveTextContent("confirmation");
    expect(screen.getByTestId("content")).toHaveTextContent(
      "This cannot be undone",
    );

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("title")).toHaveTextContent("Updated title");
    expect(screen.getByTestId("content")).toHaveTextContent(
      "This cannot be undone",
    );
  });
});
