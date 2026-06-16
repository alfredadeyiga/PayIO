import { IoArrowForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import Section from "../../../../components/layout/Section";
import Card from "../../../../components/ui/Card";
import {
  categoryIcons,
  categoryOptions,
} from "../../../../constants/categoryOptions";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useTransactions } from "../../../../hooks/features/transactions/useTransactions";
import { groupByCategory } from "../../../../utils/formatGroupData";
import { formatCapitalize } from "../../../../utils/formatCapitalize";

function Expenses() {
  const { data } = useTransactions();

  const categoryData = groupByCategory(data);

  const categoryLookup = Object.fromEntries(
    categoryData.map((item) => [item.category, item]),
  );

  const visibleCategories = categoryOptions.filter(
    (category) => category.value !== "others",
  );

  const expenses = visibleCategories.map((category) => ({
    category: category.value,
    total: categoryLookup[category.value]?.total || 0,
  }));

  return (
    <Section variant="overview" title="Expenses Breakdown">
      <Card variant="dashboard" className="min-h-[212px]">
        <div className="grid grid-cols-1 gap-3 md:gap-0 md:grid-cols-3">
          {expenses.map((expense, index) => {
            const Icon = categoryIcons[expense.category];

            return (
              <Link
                key={index}
                to="/dashboard/expenses"
                className={`flex items-center justify-between gap-4 p-2 md:px-4 border-previous/25 ${index !== 0 && "border-t-2 pt-5 md:border-t-0 md:pt-2"} ${index % 3 !== 2 && "md:border-r-2 md:pr-7"} ${index % 3 !== 0 && "md:pl-7"} ${index < 3 && "md:border-b-2 md:pb-5"} ${index > 2 && "md:pt-5"}`}
              >
                <div className="flex items-center gap-4">
                  <span className="bg-previous/25 py-4 px-2 rounded-lg text-card">
                    <Icon className="w-6 h-6" />
                  </span>

                  <div className="flex flex-col">
                    <p className="font-medium text-xs text-card">
                      {formatCapitalize(expense.category)}
                    </p>

                    <p className="font-bold text-black">
                      ${formatCurrency(expense.total)}
                    </p>
                  </div>
                </div>

                <IoArrowForward className="w-6 h-6 text-date shrink-0" />
              </Link>
            );
          })}
        </div>
      </Card>
    </Section>
  );
}

export default Expenses;
