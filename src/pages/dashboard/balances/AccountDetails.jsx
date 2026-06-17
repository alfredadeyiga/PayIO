import { Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Section from "../../../components/layout/Section";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import TableRow from "../../../components/ui/TableRow";
import { formatCurrency } from "../../../utils/formatCurrency";
import TableCard from "../../../components/ui/TableCard";
import { useModal } from "../../../context/ModalContext";
import { useBalances } from "../../../hooks/features/balances/useBalances";
import { formatAccountNumber } from "../../../utils/formatAccountNumber";
import Loader from "../../../components/ui/Loader";
import { useUpdateBalance } from "../../../hooks/features/balances/useUpdateBalance";
import { useTransactions } from "../../../hooks/features/transactions/useTransactions";
import { formatShortMonth } from "../../../utils/formatDate";
import { useVisibleData } from "../../../hooks/useVisibleData";
import { useDeleteBalance } from "../../../hooks/features/balances/useDeleteBalance";
import { toast } from "react-toastify";
import UpdateForm from "../../../components/ui/UpdateForm";

function AccountDetails() {
  const { openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const { data: balances, isLoading } = useBalances();

  const { data: transactions } = useTransactions();

  const { mutate } = useUpdateBalance();

  const { mutate: deleteId } = useDeleteBalance();

  const params = useParams();

  const account = balances?.find((balance) => balance.id === params.id);

  const isCard = !!account?.type.includes("Card");

  const accountNumber = formatAccountNumber(account?.account_number, {
    type: account?.type,
  });

  const accountTransactions = transactions?.filter(
    (tx) => tx.payment_id === account?.id,
  );

  const formatTxType = (type) => {
    return type === "revenue" ? "Credit" : "Debit";
  };

  const maxLength = 3;

  const { visibleData, hasMore, loadMore } = useVisibleData(
    maxLength,
    accountTransactions,
  );

  const hasTransactions = accountTransactions?.length > 0;

  const fields = [
    { label: `${isCard ? "Card" : "Bank"} Name`, value: account?.service },
    { label: "Account Type", value: account?.type },
    { label: "Balance", value: `$${formatCurrency(account?.total)}` },
    { label: "Branch Name", value: account?.branch_name },
    { label: `${isCard ? "Card" : "Account"} Number`, value: accountNumber },
  ];

  const columns = [
    { label: "Date", accessor: "date" },
    { label: "Status", accessor: "status" },
    { label: "Transaction Type", accessor: "transaction_type" },
    { label: "Receipt", accessor: "receipt" },
    { label: "Amount", accessor: "amount" },
  ];

  function handleUpdateBalance(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const balance = Number(formData.get("balance"));

    if (balance === account.total) {
      toast.info("Enter a different value");
      return;
    }

    mutate(
      {
        id: account.id,
        total: balance,
      },
      {
        onSuccess: () => {
          toast.success("Balance updated successfully");
          closeModal();
        },
      },
    );
  }

  function handleEditModal() {
    openModal({
      content: (
        <UpdateForm
          id="balance"
          label="Balance"
          placeholder={`$${account.total}`}
          onSubmit={handleUpdateBalance}
        ></UpdateForm>
      ),
    });
  }

  function deleteAccount() {
    deleteId(account.id);
    navigate("/dashboard/balances");
  }

  function handleDeleteAccount() {
    openModal({
      type: "confirm",
      title: `Are you sure you want to remove ${accountNumber}`,
      onConfirm: deleteAccount,
    });
  }

  if (isLoading) return <Loader />;

  if (!account) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="flex flex-col gap-8">
      <Section title="Account Details">
        <Card variant="dashboard" className="gap-10 !p-8 !pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-10">
            {fields.map((field) => (
              <div key={field.label} className="flex flex-col">
                <p className="text-date text-sm md:text-base">{field.label}</p>
                <p className="font-bold md:text-lg text-search">
                  {field.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-8 items-center">
            <Button type="button" onClick={handleEditModal}>
              Edit Balance
            </Button>

            <button
              type="button"
              className="font-semibold text-sm text-notification cursor-pointer"
              onClick={handleDeleteAccount}
            >
              Remove
            </button>
          </div>
        </Card>
      </Section>

      {hasTransactions && (
        <Section title="Transaction History">
          <Card variant="list" className="!px-8 !pb-10">
            <div className="hidden md:block">
              <Table
                variant="details"
                columns={columns}
                data={visibleData}
                rows={(transaction) => (
                  <TableRow key={transaction.id}>
                    <td className="font-normal text-search py-4">
                      {formatShortMonth(transaction.date)}
                    </td>

                    <td>Completed</td>

                    <td className="text-center">
                      {formatTxType(transaction.transaction_type)}
                    </td>

                    <td className="text-right">{transaction.receipt}</td>

                    <td className="font-semibold text-black text-right">
                      ${formatCurrency(transaction.amount)}
                    </td>
                  </TableRow>
                )}
              ></Table>
            </div>

            <div className="w-full md:hidden">
              <TableCard
                columns={columns}
                data={visibleData}
                rows={(transaction, column) =>
                  column.accessor === "amount" ? (
                    <p className="font-semibold text-black">
                      ${formatCurrency(transaction.amount)}
                    </p>
                  ) : column.accessor === "date" ? (
                    <p className="font-medium text-notification">
                      {formatShortMonth(transaction.date)}
                    </p>
                  ) : column.accessor === "status" ? (
                    <p className="font-medium text-notification">Completed</p>
                  ) : column.accessor === "transaction_type" ? (
                    <p className="font-medium text-notification">
                      {formatTxType(transaction.transaction_type)}
                    </p>
                  ) : (
                    <p className="font-medium text-notification">
                      {transaction[column.accessor]}
                    </p>
                  )
                }
              />
            </div>

            {hasMore && (
              <Button type="button" onClick={loadMore}>
                Load More
              </Button>
            )}
          </Card>
        </Section>
      )}
    </div>
  );
}

export default AccountDetails;
