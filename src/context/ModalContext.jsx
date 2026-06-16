import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    type: "form",
    title: "",
    content: null,
    onConfirm: () => {},
  });

  const openModal = ({ type = "form", title, content, onConfirm }) => {
    setModal({
      isOpen: true,
      type,
      title,
      content,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const setModalState = (updates) => {
    setModal((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ModalContext.Provider
      value={{ ...modal, openModal, closeModal, setModalState }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
