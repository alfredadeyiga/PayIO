import Section from "../../../../components/layout/Section";
import Card from "../../../../components/ui/Card";
import { formatCompact } from "../../../../utils/formatCompact";
import {
  formatDay,
  formatMonth,
  formatShortMonth,
} from "../../../../utils/formatDate";
import EmptyState from "../../../../components/ui/EmptyState";
import { useModal } from "../../../../context/ModalContext";
import BillsForm from "../../../../components/ui/BillsForm";
import { useBills } from "../../../../hooks/features/bills/useBills";

function Upcoming() {
  const { openModal } = useModal();

  const { data } = useBills();

  const bills = data?.slice(0, 2);

  const hasData = data?.length > 0;

  function handleAddBill() {
    openModal({
      content: <BillsForm />,
    });
  }


  return (
    <Section variant="overview" title="Upcoming Bills" route="/dashboard/bills">
      <Card id="bills" className={`${data.length > 1 && "!gap-6"}`}>
        {hasData ? (
          bills.map((bill, index) => (
            <div
              key={index}
              className={`flex justify-between gap-2 items-center ${data.length > 1 && index === 0 ? "pb-6 border-b border-divider" : ""}`}
            >
              <div className="flex items-center gap-5">
                <span className="bg-previous/25 flex flex-col items-center p-3 gap-1 rounded-lg">
                  <p className="font-medium text-xs text-notification">
                    {formatMonth(bill.due_date)}
                  </p>

                  <p className="font-bold text-lg md:text-xl text-black">
                    {formatDay(bill.due_date)}
                  </p>
                </span>

                <div className="flex flex-col gap-1">
                  <img src={bill.logo} alt="logo" className="w-6 h-6" />

                  <p className="font-bold text-search">{bill.bill_name}</p>

                  <p className="text-xs text-date">
                    Last Charge - {formatShortMonth(bill.last_charge)}
                  </p>
                </div>
              </div>

              <p className="px-3 py-2 border border-header rounded-lg font-bold text-search">
                ${formatCompact(bill.amount)}
              </p>
            </div>
          ))
        ) : (
          <EmptyState description="Add upcoming bills" action={handleAddBill} />
        )}
      </Card>
    </Section>
  );
}

export default Upcoming;
