import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useRef, useState } from "react";

const ActionField = ({ onEdit, onDelete }) => {
  const [showdropdown, setShowDropDown] = useState(false);

  const actionRef = useRef();

  useOutsideClick(actionRef, () => setShowDropDown(false));

  return (
    <button
      ref={actionRef}
      className="relative flex items-center justify-center py-[7px] px-[6px] md:p-0 rounded-md bg-previous/25 md:bg-transparent cursor-pointer"
      onClick={() => setShowDropDown((prev) => !prev)}
    >
      <TbDotsVertical className="w-5 h-5 text-black" />

      {showdropdown && (
        <div className="absolute right-0 top-10 text-sm z-50 bg-white border border-previous/25 rounded shadow-md overflow-hidden">
          <button
            className="w-full flex text-card items-center gap-3 py-3 px-4 hover:bg-background transition-colors cursor-pointer"
            onClick={onEdit}
          >
            <AiOutlineEdit className="w-5 h-5 shrink-0" />
            <span>Edit</span>
          </button>

          <button
            className="w-full flex items-center text-red gap-3 py-3 px-4 hover:bg-background transition-colors cursor-pointer"
            onClick={onDelete}
          >
            <MdOutlineDeleteOutline className="w-5 h-5 shrink-0" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </button>
  );
};

export default ActionField;
