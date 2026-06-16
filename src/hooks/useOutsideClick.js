import { useEffect } from "react";

function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") callback();
    }

    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, []);
}

export default useOutsideClick;
