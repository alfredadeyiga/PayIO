import { useRef, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function PasswordField({
  variant = "auth",
  id = "password",
  label,
  children,
  error,
}) {
  const [hidden, setHidden] = useState(true);
  const passwordRef = useRef();

  function handleToggle() {
    setHidden((prev) => !prev);
    passwordRef.current.focus();
  }

  const PasswordToggle = hidden ? IoEyeOutline : IoEyeOffOutline;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label
          htmlFor={id}
          className={`${variant === "auth" ? "font-medium text-secondary" : "font-semibold text-search"}`}
        >
          {label}
        </label>

        {children}
      </div>

      <div className="relative">
        <input
          id={id}
          name={id}
          ref={passwordRef}
          type={hidden ? "password" : "text"}
          required
          placeholder={hidden ? "•••••••••••" : "152@@##PAss"}
          className={`w-full border-border text-outline rounded-lg pr-14 ${variant === "auth" ? "border py-3 pl-4 placeholder-placeholder" : "py-4 pl-5 md:pl-6 placeholder-card"}  ${error && "border-red"}`}
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleToggle}
          className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${variant === "auth" ? "text-placeholder" : "text-card"}`}
        >
          <PasswordToggle className="w-6 h-6" />
        </button>
      </div>

      {error && <p className="font-normal text-red text-xs">{error}</p>}
    </div>
  );
}

export default PasswordField;
