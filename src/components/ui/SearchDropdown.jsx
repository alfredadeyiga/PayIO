import { useNavigate } from "react-router-dom";
import { categoryIcons } from "../../constants/categoryOptions";
import { useTransactions } from "../../hooks/features/transactions/useTransactions";
import { formatCurrency } from "../../utils/formatCurrency";
import Loader from "./Loader";

function SearchDropdown({ query, onSelect }) {
  const { data, isLoading } = useTransactions();

  const navigate = useNavigate();

  const filteredData = data?.filter((t) =>
    [t.item_name, t.shop_name]
      .join(" ")
      .toLowerCase()
      .includes(query?.toLowerCase()),
  );

  return (
    <div className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg border border-previous/25 z-50 overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
        {isLoading && (
          <div className="py-10">
            <Loader variant="button" />
          </div>
        )}

        {filteredData?.length === 0 ? (
          <p className="p-4 text-sm text-date">No results found</p>
        ) : (
          filteredData?.map((item) => {
            const Icon = categoryIcons[item.category];

            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelect();
                  navigate(
                    `/dashboard/transactions?tab=${item.transaction_type}`,
                  );
                }}
                className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-previous/25 transition-colors duration-300 ease-in-out"
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-previous/25">
                    <Icon className="w-4 h-4 text-black" />
                  </span>

                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-black">
                      {item.item_name}
                    </p>

                    <p className="text-xs text-date">{item.shop_name}</p>
                  </div>
                </div>

                <p
                  className={`text-sm font-semibold ${item.transaction_type === "revenue" ? "text-green" : "text-red"}`}
                >
                  ${formatCurrency(item.amount)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SearchDropdown;
