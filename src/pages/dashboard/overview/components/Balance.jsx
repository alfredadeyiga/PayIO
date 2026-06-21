import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { TbCircleArrowUpRightFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import Section from "../../../../components/layout/Section";
import Card from "../../../../components/ui/Card";
import { useState } from "react";
import { formatCurrencyRounded } from "../../../../utils/formatCurrency";
import EmptyState from "../../../../components/ui/EmptyState";
import { useModal } from "../../../../context/ModalContext";
import { useBalances } from "../../../../hooks/features/balances/useBalances";
import { formatAccountNumber } from "../../../../utils/formatAccountNumber";
import BalanceForm from "../../../../components/ui/BalanceForm";

function Balance() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { openModal } = useModal();

  const { data } = useBalances();

  const balances = data?.slice(0, 3);

  const hasData = balances?.length > 0;

  const totalBalance = data?.reduce((sum, item) => sum + item.total, 0);

  function handleNext() {
    setCurrentIndex((prev) => Math.min(prev + 1, balances.length - 1));
  }

  function handlePrevious() {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }

  function handleAddBalance() {
    openModal({ content: <BalanceForm /> });
  }

  return (
    <Section variant="overview" title="Total Balance">
      <Card id="balances">
        {hasData ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center pb-3 border-b border-divider">
                <p className="font-bold text-2xl text-black">
                  ${formatCurrencyRounded(totalBalance)}
                </p>

                <p className="font-medium text-sm text-search">All Accounts</p>
              </div>

              <div className="w-full flex bg-primary p-4 gap-4 rounded overflow-x-hidden">
                {balances.map((balance, index) => {
                  const isCard = !!balance.type.includes("Card");

                  const accountNumber = formatAccountNumber(
                    balance.account_number,
                    { type: balance.type },
                  );

                  return (
                    <div
                      key={index}
                      className={`shrink-0 w-full flex justify-between gap-4 transition-translate duration-300 ease-in-out ${currentIndex === 1 ? "translate-x-[calc(-100%-16px)]" : currentIndex === 2 && "translate-x-[calc(-200%-32px)]"} ${isCard ? "items-center" : "items-end"}`}
                    >
                      <div>
                        <p className="font-medium text-sm text-white/70">
                          Account Type
                        </p>
                        <p className="font-semibold text-white tracking-wide">
                          {balance.type}
                        </p>
                        <p className="font-medium text-sm text-white/70">
                          {accountNumber}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        {isCard && (
                          <img
                            src={balance.icon}
                            className="w-7 h-7"
                            alt="logo"
                          />
                        )}

                        <div className="flex items-center gap-3 text-white">
                          <p className="font-bold">
                            ${formatCurrencyRounded(balance.total)}
                          </p>

                          <Link to="/dashboard/balances">
                            <TbCircleArrowUpRightFilled className="w-6 h-6" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                className={`flex items-center gap-1 font-medium text-sm transition-colors duration-300 ease-in-out ${currentIndex === 0 ? "text-previous" : "text-black cursor-pointer"}`}
                onClick={handlePrevious}
              >
                <MdKeyboardArrowLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex gap-2">
                {balances.map((_, index) => (
                  <span
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${currentIndex === index ? "bg-primary" : "bg-previous"}`}
                    onClick={() => setCurrentIndex(index)}
                  ></span>
                ))}
              </div>

              <button
                type="button"
                className={`flex items-center gap-1 font-medium text-sm transition-colors duration-300 ease-in-out ${currentIndex === balances.length - 1 ? "text-previous" : "text-black cursor-pointer"}`}
                onClick={handleNext}
              >
                Next
                <MdKeyboardArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <EmptyState
            description="Add card to show balance"
            action={handleAddBalance}
          />
        )}
      </Card>
    </Section>
  );
}

export default Balance;
