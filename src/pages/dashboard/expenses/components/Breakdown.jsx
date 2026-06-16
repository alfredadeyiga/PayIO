import { IoMdArrowUp } from "react-icons/io";
import Section from "../../../../components/layout/Section";
import Card from "../../../../components/ui/Card";
import { categoryIcons } from "../../../../constants/categoryOptions";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useTransactions } from "../../../../hooks/features/transactions/useTransactions";
import { groupByCategory } from "../../../../utils/formatGroupData";
import { formatCapitalize } from "../../../../utils/formatCapitalize";

function Breakdown() {
  const { data } = useTransactions();

  const expenses = groupByCategory(data);

  if (expenses.length < 1) return null;

  return (
    <Section title="Expenses Breakdown">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {expenses.map((exp, index) => {
          const Icon = categoryIcons[exp.category];

          return (
            <Card key={index} variant="breakdown">
              <div className="bg-header w-full flex items-center gap-4 px-6 py-4 rounded-t-lg">
                <span className="bg-previous px-2 py-3 rounded-lg text-search">
                  <Icon className="w-6 h-6" />
                </span>

                <div className="flex justify-between gap-3 items-center w-full">
                  <div className="flex flex-col">
                    <p className="font-medium text-sm md:text-base text-notification">
                      {formatCapitalize(exp.category)}
                    </p>

                    <p className="font-bold md:text-lg text-black">
                      ${formatCurrency(exp.total)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end md:gap-1">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-notification">
                        {Math.abs(exp.percentChange)}%
                      </p>
                      {exp.change && (
                        <IoMdArrowUp
                          className={`w-4 h-4 ${exp.change === "Increase" ? "text-red" : "text-green rotate-180"}`}
                        />
                      )}
                    </div>

                    <p className="text-xs text-notification text-right">
                      Compared to last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col px-6 rounded-b-lg">
                {exp.details.map((detail, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-4 ${index !== 0 && "border-t border-previous/25"}`}
                  >
                    <p className="font-semibold text-search">{detail.title}</p>

                    <div className="flex flex-col items-end gap-1">
                      <p className="font-semibold text-search">
                        ${formatCurrency(detail.amount)}
                      </p>

                      <p className="text-sm text-date">{detail.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

export default Breakdown;
