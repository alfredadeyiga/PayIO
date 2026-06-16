function TableCard({ data, rows, columns }) {
  return (
    <div className="flex flex-col gap-6">
      {data.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col gap-3 ${index !== 0 && "border-t border-previous/25 pt-6"}`}
        >
          {columns.map((column) => (
            <div
              key={column.label}
              className="flex gap-5 justify-between items-center"
            >
              <p className="font-semibold text-black text-left">
                {column.label}
              </p>

              <div className="text-right">{rows(item, column)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableCard;
