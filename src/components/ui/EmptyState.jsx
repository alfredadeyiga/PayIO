import { IoIosAddCircleOutline } from "react-icons/io";

function EmptyState({ description = "", action }) {
  return (
    <div className="flex flex-col py-6 h-full gap-4 items-center justify-center text-center text-previous">
      <button type="button" className="cursor-pointer" onClick={action}>
        <IoIosAddCircleOutline className="w-[105px] h-[105px]" />
      </button>

      {description}
    </div>
  );
}

export default EmptyState;
