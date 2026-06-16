function Table({ variant = "default", columns, data, rows }) {
  return (
    <table className="w-full table-fixed">
      <thead className="font-bold text-black">
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              className={`${variant === "default" ? "pb-4" : "pb-6"} ${variant === "default" && index === 4 ? "pr-7 xl:pr-13" : ""} ${index < 2 ? "text-left" : index > 2 && "text-right"}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody
        className={`${variant === "default" && "font-medium text-notification"}`}
      >
        {data.map((item) => rows(item))}
      </tbody>
    </table>
  );
}

export default Table;
