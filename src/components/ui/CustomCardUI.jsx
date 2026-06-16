import { getLogo } from "../../utils/getLogo";

function CustomCardUI({ value }) {
  return (
    <div className="flex gap-3 md:gap-4 items-center">
      <img src={getLogo(value)} className="w-[26px] h-[26px]" alt="logo" />

      {value}
    </div>
  );
}

export default CustomCardUI;
