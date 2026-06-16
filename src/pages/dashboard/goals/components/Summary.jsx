import { MdKeyboardArrowDown } from "react-icons/md";
import Card from "../../../../components/ui/Card";
import { useRef, useState } from "react";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import EmptyState from "../../../../components/ui/EmptyState";
import SavingsCard from "../../../../components/ui/SavingsCard";
import SavingsChart from "../../../../components/ui/SavingsChart";
import { useModal } from "../../../../context/ModalContext";
import TransactionsForm from "../../../../components/ui/TransactionsForm";
import { useTransactions } from "../../../../hooks/features/transactions/useTransactions";
import Loader from "../../../../components/ui/Loader";
import { formatSavingsChartData } from "../../../../utils/formatGroupData";
import { formatPeriod, getCurrentPeriod } from "../../../../utils/formatDate";
import { formatPeriodOptions } from "../../../../utils/formatPeriodOptions";

function Summary() {
  const [showOptions, setShowOptions] = useState(false);

  const defaultPeriod = getCurrentPeriod();

  const defaultOption = {
    value: defaultPeriod,
    label: defaultPeriod,
  };

  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const { data: transactions, isLoading } = useTransactions();

  const { openModal } = useModal();

  const monthRef = useRef();

  useOutsideClick(monthRef, () => setShowOptions(false));

  const dropdownOptions = [
    defaultOption,
    ...(transactions?.map((d) => ({
      value: formatPeriod(d.date),
      label: formatPeriod(d.date),
    })) || []),
  ];

  function handleAddTransaction() {
    openModal({ content: <TransactionsForm /> });
  }

  const options = formatPeriodOptions(dropdownOptions);

  const data = formatSavingsChartData(transactions, selectedOption.value);

  if (isLoading) return <Loader />;

  return (
    <Card variant="dashboard" className="!p-6">
      {transactions.length !== 0 ? (
        <div className="flex flex-col gap-4 xl:gap-6">
          <div className="flex justify-between gap-2 items-center">
            <div className="flex justify-between items-center gap-7 w-full xl:w-auto">
              <p className="font-bold text-search">Savings Summary</p>

              <div
                ref={monthRef}
                className="relative inline-block w-fit"
                onClick={() => setShowOptions((prev) => !prev)}
              >
                <button
                  type="button"
                  className="flex items-center gap-3 pl-2 text-xs text-notification cursor-pointer"
                >
                  {selectedOption.label}
                  <MdKeyboardArrowDown className="w-4 h-4 text-search" />
                </button>

                {showOptions && (
                  <CustomDropdown
                    options={options}
                    setSelected={(option) => setSelectedOption(option)}
                    onClick={() => setShowOptions(false)}
                    className="text-xs text-notification"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="hidden xl:block">
            <SavingsChart data={data} />
          </div>

          <div className="xl:hidden">
            <SavingsCard data={data} />
          </div>
        </div>
      ) : (
        <EmptyState
          description="Add your transactions to see chart data"
          action={handleAddTransaction}
        />
      )}
    </Card>
  );
}

export default Summary;
