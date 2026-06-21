import Section from "../../../../components/layout/Section";
import Card from "../../../../components/ui/Card";
import Tabs from "../../../../components/ui/Tabs";
import { categoryIcons } from "../../../../constants/categoryOptions";
import { useFilteredTransactions } from "../../../../hooks/useFilteredTransactions";
import { defaultTabs } from "../../../../constants/defaultTabs";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useState } from "react";
import EmptyState from "../../../../components/ui/EmptyState";
import { useModal } from "../../../../context/ModalContext";
import TransactionsForm from "../../../../components/ui/TransactionsForm";
import { useTransactions } from "../../../../hooks/features/transactions/useTransactions";
import { formatShortMonth } from "../../../../utils/formatDate";

function Recents() {
  const [activeTab, setActiveTab] = useState("all");

  const { openModal } = useModal();

  const { data } = useTransactions();

  const filteredTransactions = useFilteredTransactions(data, activeTab);

  const hasData = filteredTransactions?.length > 0;

  const transactions = filteredTransactions?.slice(0, 5);

  function handleAddTransaction() {
    openModal({ content: <TransactionsForm /> });
  }

  return (
    <Section
      variant="overview"
      title="Recent Transactions"
      route="/dashboard/transactions?tab=all"
    >
      <Card className={`${hasData && "pt-4 pb-8"}`}>
        {hasData ? (
          <div className="flex flex-col gap-3">
            <Tabs
              tabs={defaultTabs}
              activeTab={activeTab}
              onChange={(tab) => setActiveTab(tab)}
            />

            <div className="flex flex-col">
              {transactions.map((transaction, index) => {
                const Icon = categoryIcons[transaction.category];

                return (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between gap-5 py-6 ${index !== 0 && "border-t border-divider"}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="bg-previous/25 p-2 rounded-lg text-notification">
                        <Icon className="w-6 h-6" />
                      </span>

                      <div className="flex flex-col">
                        <p className="font-semibold text-black">
                          {transaction.item_name}
                        </p>

                        <p className="text-xs text-date">
                          {transaction.shop_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <p className="font-semibold text-search">
                        ${formatCurrency(transaction.amount)}
                      </p>

                      <p className="text-xs text-date">
                        {formatShortMonth(transaction.date)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState
            description="Add recent transactions"
            action={handleAddTransaction}
          />
        )}
      </Card>
    </Section>
  );
}

export default Recents;
