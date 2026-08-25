import { IoIosAddCircleOutline } from "react-icons/io";

function EmptyState({ description = "", action }) {
  return (
    <button
      type="button"
      className="flex flex-col py-6 h-full gap-4 items-center justify-center text-center text-previous cursor-pointer"
      onClick={action}
    >
      <IoIosAddCircleOutline className="w-[105px] h-[105px]" />

      {description}
    </button>
  );
}

export default EmptyState;
