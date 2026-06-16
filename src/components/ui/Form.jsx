import { useLayoutEffect, useRef, useState } from "react";
import Button from "./Button";
import Loader from "./Loader";
import { useModal } from "../../context/ModalContext";

function Form({ variant = "auth", onSubmit, children, className }) {
  const [isScrollable, setIsScrollable] = useState(false);

  const { isLoading } = useModal();

  const childrenRef = useRef();

  useLayoutEffect(() => {
    const el = childrenRef.current;

    if (el) {
      setIsScrollable(el.scrollHeight > el.clientHeight);
    }
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className={`w-full flex flex-col ${variant === "settings" ? "gap-10 items-center md:items-start" : "gap-8"} ${variant === "dashboard" && "items-center"} ${className}`}
    >
      {variant === "dashboard" ? (
        <>
          <div
            ref={childrenRef}
            className={`w-full flex flex-col gap-6 items-start md:max-h-[205px] overflow-y-auto custom-scrollbar ${isScrollable ? "max-h-[190px] md:pr-3" : "max-h-[205px]"}`}
          >
            {children}
          </div>

          <Button type="submit" className="min-w-[200px]" disabled={isLoading}>
            {isLoading ? (
              <Loader variant="button" className="!w-5 !h-5" />
            ) : (
              <p>Save</p>
            )}
          </Button>
        </>
      ) : (
        children
      )}
    </form>
  );
}

export default Form;
