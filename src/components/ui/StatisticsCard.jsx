import { MdKeyboardArrowDown } from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import Card from "./Card";
import { formatCompact } from "../../utils/formatCompact";
import { useRef, useState } from "react";
import CustomDropdown from "./CustomDropdown";
import useOutsideClick from "../../hooks/useOutsideClick";
import EmptyState from "./EmptyState";
import { useModal } from "../../context/ModalContext";
import TransactionsForm from "./TransactionsForm";
import { useTransactions } from "../../hooks/features/transactions/useTransactions";
import { groupByMonth, groupByWeek } from "../../utils/formatGroupData";

function StatisticsCard({
  variant = "overview",
  selectedOption,
  setSelectedOption,
}) {
  const [showOptions, setShowOptions] = useState(false);

  const { openModal } = useModal();

  const { data: transactions } = useTransactions();

  const hasData = transactions?.length > 0;

  const dropdownRef = useRef();

  useOutsideClick(dropdownRef, () => setShowOptions(false));

  const options = [
    { value: "weekly", label: "Weekly Comparison" },
    { value: "monthly", label: "Monthly Comparison" },
  ];

  const selectedLabel = options.find(
    (option) => option.value === selectedOption,
  )?.label;

  const groupParams = { transactions, limit: variant === "overview" ? 6 : 11 };

  const filteredData =
    selectedOption === "monthly"
      ? groupByMonth(groupParams)
      : groupByWeek(groupParams);

  const mobileData = filteredData.filter(
    (item) => item.revenue > 0 || item.expenses > 0,
  );

  function handleAddTransaction() {
    openModal({ content: <TransactionsForm /> });
  }

  return (
    <Card id="stats" variant="dashboard" className={`${hasData && "md:pr-10"}`}>
      {hasData ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div
              ref={dropdownRef}
              className="relative inline-block -ml-4 md:ml-0"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              <button
                type="button"
                className="flex gap-3 items-center justify-between cursor-pointer pl-4 font-semibold text-black min-w-[200px]"
              >
                {selectedLabel}
                <MdKeyboardArrowDown className="w-6 h-6" />
              </button>

              {showOptions && (
                <CustomDropdown
                  options={options}
                  setSelected={(option) => setSelectedOption(option.value)}
                  onClick={() => setShowOptions(false)}
                  className="font-semibold text-black pl-4"
                />
              )}
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 font-medium text-xs text-search">
                <span className="bg-primary w-4 h-2 rounded-sm"></span>
                Revenue
              </div>

              <div className="flex items-center gap-2 font-medium text-xs text-search">
                <span className="bg-header w-4 h-2 rounded-sm"></span>
                Expenses
              </div>
            </div>
          </div>

          <div className="h-[184px] overflow-hidden hidden md:block">
            <ResponsiveContainer width="100%" height="105%">
              <BarChart
                data={filteredData}
                barGap={8}
                barSize={16}
                margin={{ top: 10 }}
              >
                <CartesianGrid stroke="#F3F3F3" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9F9F9F", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9F9F9F", fontSize: 14 }}
                  tickFormatter={(value) =>
                    `$${formatCompact(value).toLowerCase()}`
                  }
                />
                <Bar dataKey="expenses" fill="#E8E8E8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#299D91" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {mobileData.map((item) => (
              <li
                key={item.label}
                className="flex justify-between gap-4 py-3 px-4 font-semibold bg-white border border-previous/25 rounded shadow-xs"
              >
                <span className="text-black">{item.label}</span>
                <div className="flex gap-4">
                  <span className="text-green">
                    +${formatCompact(item.revenue)}
                  </span>
                  <span className="text-red">
                    -${formatCompact(item.expenses)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          description="Add transactions to see statistics data"
          action={handleAddTransaction}
        />
      )}
    </Card>
  );
}

export default StatisticsCard;
