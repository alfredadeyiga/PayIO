function CustomDropdown({ options, setSelected, onClick, className }) {
  return (
    <div
      className="absolute top-full mt-2 bg-white shadow-md border border-previous/25 rounded w-full z-10 max-h-[110px] overflow-y-auto custom-scrollbar"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => setSelected(option)}
          className={`p-2 text-left hover:bg-previous/25 cursor-pointer ${className}`}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}

export default CustomDropdown;
