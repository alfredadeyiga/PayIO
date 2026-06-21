import Button from "../../../components/ui/Button";
import Section from "../../../components/layout/Section";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import TableRow from "../../../components/ui/TableRow";
import Tabs from "../../../components/ui/Tabs";
import { categoryIcons } from "../../../constants/categoryOptions";
import { useFilteredTransactions } from "../../../hooks/useFilteredTransactions";
import { defaultTabs } from "../../../constants/defaultTabs";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useTabParams } from "../../../hooks/useTabParams";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../../../components/ui/EmptyState";
import TableCard from "../../../components/ui/TableCard";
import { useModal } from "../../../context/ModalContext";
import TransactionsForm from "../../../components/ui/TransactionsForm";
import { useTransactions } from "../../../hooks/features/transactions/useTransactions";
import { formatShortMonth } from "../../../utils/formatDate";
import { useVisibleData } from "../../../hooks/useVisibleData";
import ActionField from "../../../components/ui/ActionField";
import { useDeleteTransaction } from "../../../hooks/features/transactions/useDeleteTransaction";

function Transactions() {
  const { openModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "all";

  useTabParams("all", defaultTabs);

  const { mutate: deleteTransaction } = useDeleteTransaction();

  const { data } = useTransactions();

  const columns = [
    { label: "Item", accessor: "item_name" },
    { label: "Shop Name", accessor: "shop_name" },
    { label: "Date", accessor: "date" },
    { label: "Payment Method", accessor: "payment_method" },
    { label: "Amount", accessor: "price" },
  ];

  function handleAddTx() {
    openModal({
      content: <TransactionsForm />,
    });
  }

  function handleUpdateTx(id) {
    openModal({
      content: <TransactionsForm currentId={id} />,
    });
  }

  function handleDeleteTx(id, name) {
    openModal({
      type: "confirm",
      title: `Are you sure you want to delete "${name}"?`,
      onConfirm: () => deleteTransaction(id),
    });
  }

  const ActionButton = ({ id, name }) => {
    return (
      <ActionField
        onEdit={() => handleUpdateTx(id)}
        onDelete={() => handleDeleteTx(id, name)}
      />
    );
  };

  const filteredTransactions = useFilteredTransactions(data, activeTab);

  const hasData = filteredTransactions?.length > 0;

  const maxLength = 6;

  const { visibleData, hasMore, loadMore } = useVisibleData(
    maxLength,
    filteredTransactions,
  );

  return (
    <Section title="Recent Transactions">
      <Tabs
        tabs={defaultTabs}
        activeTab={activeTab}
        onChange={(tab) => setSearchParams({ tab: tab })}
      />

      <Card variant="list" className={`${!hasData && "!py-10"}`}>
        {hasData ? (
          <div className="w-full flex flex-col items-center gap-10">
            <div className="w-full flex flex-col gap-8">
              <div className="hidden md:block">
                <Table
                  columns={columns}
                  data={visibleData}
                  rows={(transaction) => {
                    const Icon = categoryIcons[transaction.category];

                    return (
                      <TableRow key={transaction.id}>
                        <td className="py-6">
                          <div className="flex items-center gap-4 font-semibold text-black pr-4">
                            <Icon className="w-6 h-6 shrink-0" />
                            <p className="truncate">{transaction.item_name}</p>
                          </div>
                        </td>

                        <td>
                          <p className="truncate">{transaction.shop_name}</p>
                        </td>

                        <td className="text-center">
                          {formatShortMonth(transaction.date)}
                        </td>

                        <td className="text-right">
                          {transaction.payment_method}
                        </td>

                        <td className="font-semibold text-black">
                          <div className="flex items-center gap-2 xl:gap-8 justify-end">
                            <span>${formatCurrency(transaction.amount)}</span>

                            <ActionButton
                              id={transaction.id}
                              name={transaction.item_name}
                            />
                          </div>
                        </td>
                      </TableRow>
                    );
                  }}
                ></Table>
              </div>

              <div className="w-full md:hidden">
                <TableCard
                  columns={columns}
                  data={visibleData}
                  rows={(transaction, column) => {
                    const Icon = categoryIcons[transaction.category];

                    return column.accessor === "price" ? (
                      <div className="flex items-center gap-4 font-semibold text-black">
                        <span>${formatCurrency(transaction.amount)}</span>

                        <ActionButton
                          id={transaction.id}
                          name={transaction.item_name}
                        />
                      </div>
                    ) : column.accessor === "itemName" ? (
                      <div className="flex items-center gap-3 font-semibold text-black">
                        <Icon className="w-6 h-6 shrink-0" />
                        {transaction.item_name}
                      </div>
                    ) : column.accessor === "date" ? (
                      <p className="font-medium text-notification">
                        {formatShortMonth(transaction.date)}
                      </p>
                    ) : (
                      <p className="font-medium text-notification">
                        {transaction[column.accessor]}
                      </p>
                    );
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 md:gap-8">
              {hasMore && (
                <Button type="button" onClick={loadMore}>
                  Load More
                </Button>
              )}

              <Button type="button" onClick={handleAddTx}>
                Add Transaction
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState description="No transactions yet" action={handleAddTx} />
        )}
      </Card>
    </Section>
  );
}

export default Transactions;
