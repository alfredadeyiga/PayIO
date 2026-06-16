import Button from "../../../components/ui/Button";
import Section from "../../../components/layout/Section";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import TableRow from "../../../components/ui/TableRow";
import { formatCompact } from "../../../utils/formatCompact";
import {
  formatDay,
  formatMonth,
  formatShortMonth,
} from "../../../utils/formatDate";
import EmptyState from "../../../components/ui/EmptyState";
import TableCard from "../../../components/ui/TableCard";
import { useModal } from "../../../context/ModalContext";
import BillsForm from "../../../components/ui/BillsForm";
import Loader from "../../../components/ui/Loader";
import { useBills } from "../../../hooks/features/bills/useBills";
import ActionField from "../../../components/ui/ActionField";
import { useDeleteBills } from "../../../hooks/features/bills/useDeleteBills";

function Bills() {
  const { openModal } = useModal();

  const { data, isLoading } = useBills();

  const { mutate: deleteBill } = useDeleteBills();

  const hasData = data?.length > 0;

  const columns = [
    { label: "Due Date", accessor: "date" },
    { label: "Logo", accessor: "logo" },
    { label: "Item Description", accessor: "title" },
    { label: "Last Charge", accessor: "lastCharge" },
    { label: "Amount", accessor: "amount" },
  ];

  function handleAddBill() {
    openModal({
      content: <BillsForm />,
    });
  }

  function handleUpdateBill(id) {
    openModal({
      content: <BillsForm currentId={id} />,
    });
  }

  function handleDeleteBill(id, name) {
    openModal({
      type: "confirm",
      title: `Are you sure you want to delete "${name}"?`,
      onConfirm: () => deleteBill(id),
    });
  }

  const ActionButton = ({ id, name }) => {
    return (
      <ActionField
        onEdit={() => handleUpdateBill(id)}
        onDelete={() => handleDeleteBill(id, name)}
      />
    );
  };

  if (isLoading) return <Loader />;

  return (
    <Section title="Upcoming Bills">
      <Card variant="list" className={`!px-6 !pb-12 ${!hasData && "!py-9"}`}>
        {hasData ? (
          <div className="w-full flex flex-col items-center gap-10">
            <div className="hidden md:block">
              <Table
                columns={columns}
                data={data}
                rows={(bill) => (
                  <TableRow key={bill.id}>
                    <td className="py-6">
                      <span className="bg-previous/25 w-18 flex flex-col items-center gap-2 py-3 rounded-lg">
                        <p className="font-medium text-card">
                          {formatMonth(bill.due_date)}
                        </p>

                        <p className="font-bold text-xl text-search">
                          {formatDay(bill.due_date)}
                        </p>
                      </span>
                    </td>

                    <td>
                      <img
                        src={bill.logo}
                        alt="logo"
                        className="w-[60px] h-[60px]"
                      />
                    </td>

                    <td className="py-6">
                      <div className="flex flex-col text-center gap-2">
                        <p className="font-bold text-lg text-black">
                          {bill.bill_name}
                        </p>

                        <p className="font-normal text-sm text-date">
                          {bill.description}
                        </p>
                      </div>
                    </td>

                    <td className="text-right text-date">
                      {formatShortMonth(bill.last_charge)}
                    </td>

                    <td>
                      <div className="flex items-center gap-3 xl:gap-8 justify-end">
                        <span className="py-2 px-[13px] border border-header rounded-lg font-bold text-lg text-black">
                          ${formatCompact(bill.amount)}
                        </span>

                        <ActionButton id={bill.id} name={bill.bill_name} />
                      </div>
                    </td>
                  </TableRow>
                )}
              ></Table>
            </div>

            <div className="w-full md:hidden">
              <TableCard
                columns={columns}
                data={data}
                rows={(bill, column) =>
                  column.accessor === "date" ? (
                    <p className="font-medium text-notification">
                      {formatShortMonth(bill.due_date)}
                    </p>
                  ) : column.accessor === "logo" ? (
                    <img src={bill.logo} alt="logo" className="w-6 h-6" />
                  ) : column.accessor === "title" ? (
                    <p className="font-bold text-black">{bill.bill_name}</p>
                  ) : column.accessor === "lastCharge" ? (
                    <p className="font-medium text-notification">
                      {formatShortMonth(bill.last_charge)}
                    </p>
                  ) : (
                    <div className="flex items-center gap-4 font-bold text-black">
                      <span>${formatCompact(bill.amount)}</span>

                      <ActionButton id={bill.id} name={bill.bill_name} />
                    </div>
                  )
                }
              />
            </div>

            <Button type="button" onClick={handleAddBill}>
              Add New Bill
            </Button>
          </div>
        ) : (
          <EmptyState description="Add upcoming bills" action={handleAddBill} />
        )}
      </Card>
    </Section>
  );
}

export default Bills;
