import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import Button from "./Button";
import { useModal } from "../../context/ModalContext";
import Loader from "./Loader";

function Modal() {
  const { closeModal, type, content, title, onConfirm, isLoading } = useModal();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function onCloseModal(e) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  if (isLoading && type === "confirm") return <Loader />;

  return (
    <div
      className="bg-black/15 px-6 absolute w-full flex justify-center items-center inset-0 z-50"
      onClick={onCloseModal}
    >
      <div className="relative flex justify-center bg-white rounded-xl pt-16 p-14 md:p-16 md:pb-12 w-full max-w-[488px]">
        {type === "form" ? (
          content
        ) : (
          <div className="flex flex-col items-center gap-10 md:gap-12 max-w-[270px]">
            <h2 className="font-semibold text-lg text-black text-center">
              {title}
            </h2>

            <div className="flex flex-col items-center w-full max-w-[200px] md:w-auto md:max-w-none md:flex-row gap-5 md:gap-12">
              <button
                type="button"
                className="font-semibold text-notification cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </button>

              <Button
                type="button"
                onClick={onConfirm}
                className="min-w-[140px]"
              >
                <p>Yes, Continue</p>
              </Button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="absolute top-7 right-7 text-search cursor-pointer"
          onClick={closeModal}
        >
          <MdClose className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}

export default Modal;
