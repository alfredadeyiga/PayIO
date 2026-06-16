import { MdKeyboardArrowDown } from "react-icons/md";
import CustomDropdown from "./CustomDropdown";
import { useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";

function SelectField({
  label,
  options,
  setSelectedOption,
  selectedOption,
  ref,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);

  useOutsideClick(ref, () => {
    setShowOptions(false);
    setFocus(false);
  });

  const selectedOptionObj = options?.find(
    (option) => option.value === selectedOption,
  );

  const selectedLabel =
    selectedOptionObj?.displayLabel || selectedOptionObj?.label;

  return (
    <div className="flex flex-col gap-2 font-semibold text-search items-start w-full">
      {label}

      <div
        ref={ref}
        className="relative w-full"
        onClick={() => setShowOptions((prev) => !prev)}
      >
        <button
          type="button"
          className={`flex items-center justify-between font-normal w-full border rounded-lg py-4 px-5 md:px-6 cursor-pointer ${active ? "text-outline" : "text-card"} ${focus ? "border-transparent shadow-outline-inset" : "border-previous"}`}
        >
          {selectedLabel}

          <MdKeyboardArrowDown
            className={`w-6 h-6 ${showOptions && "rotate-180"}`}
          />
        </button>

        {showOptions && (
          <CustomDropdown
            options={options}
            setSelected={(option) => {
              setSelectedOption(option.value);
              setActive(true);
              setFocus(true);
            }}
            onClick={() => setShowOptions(false)}
            className="font-normal text-card pl-5 md:pl-6"
          />
        )}
      </div>
    </div>
  );
}

export default SelectField;
