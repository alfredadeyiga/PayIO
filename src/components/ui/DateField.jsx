import { useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import { formatShortMonth } from "../../utils/formatDate";
import { FaRegCalendar } from "react-icons/fa";

function DateField({
  label,
  id,
  variant = "due",
  required = true,
  defaultValue,
}) {
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);

  const dateValue = value || defaultValue;

  const dateLabel = formatShortMonth(dateValue);

  const dateRef = useRef();

  useOutsideClick(dateRef, () => setFocus(false));

  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  const today = `${year}-${month}-${day}`;

  return (
    <div className="w-full flex flex-col gap-2 font-semibold text-search items-start">
      <label htmlFor={id}>{label}</label>

      <button
        type="button"
        className={`relative flex items-center justify-between font-normal border w-full rounded-lg py-4 px-5 md:px-6 ${value ? "text-outline" : "text-card"} ${focus ? "border-transparent shadow-outline-inset" : "border-previous"}`}
        onClick={() => dateRef.current?.showPicker()}
      >
        <input
          id={id}
          name={id}
          ref={dateRef}
          type="date"
          required={required}
          min={variant === "due" ? today : null}
          max={variant === "last" ? today : null}
          onChange={(e) => {
            setFocus(true);
            setValue(e.target.value);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {dateValue ? dateLabel : "14 May 2022"}

        <FaRegCalendar className="w-4 h-4" />
      </button>
    </div>
  );
}

export default DateField;
