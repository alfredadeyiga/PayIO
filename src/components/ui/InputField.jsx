import { useRef } from "react";
import { AiOutlineEdit } from "react-icons/ai";

function InputField({
  variant = "auth",
  label,
  id,
  type = "text",
  placeholder,
  error,
  required = true,
  min = 1,
}) {
  const inputRef = useRef();

  function handleFocus() {
    inputRef.current.focus();
  }

  const variants = {
    auth: "border-border",
    dashboard: "border-previous",
    settings: "border-none",
  };

  return (
    <div
      className={`w-full flex flex-col gap-2 ${variant === "auth" ? "font-medium text-secondary" : "font-semibold text-search items-start"}`}
    >
      <label htmlFor={id}>{label}</label>

      <div className="flex gap-6 items-center w-full justify-between">
        <input
          id={id}
          name={id}
          ref={inputRef}
          type={type}
          required={required}
          min={type === "number" ? min : null}
          step={type === "number" ? "0.01" : null}
          placeholder={placeholder}
          className={`font-normal border w-full text-outline truncate rounded-lg ${variant === "auth" ? "placeholder-placeholder py-3 px-4" : "placeholder-card py-4 px-5 md:px-6"} ${variants[variant]} ${error && "border-red"}`}
        />

        {variant === "settings" && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleFocus}
            className="cursor-pointer text-card"
          >
            <AiOutlineEdit className="w-6 h-6" />
          </button>
        )}
      </div>

      {error && <p className="font-normal text-red text-xs">{error}</p>}
    </div>
  );
}

export default InputField;
