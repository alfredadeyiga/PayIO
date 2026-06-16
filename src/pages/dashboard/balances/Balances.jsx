import { MdKeyboardArrowRight } from "react-icons/md";
import Section from "../../../components/layout/Section";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { useModal } from "../../../context/ModalContext";
import { useBalances } from "../../../hooks/features/balances/useBalances";
import Loader from "../../../components/ui/Loader";
import BalanceForm from "../../../components/ui/BalanceForm";
import { formatAccountNumber } from "../../../utils/formatAccountNumber";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useDeleteBalance } from "../../../hooks/features/balances/useDeleteBalance";

function Balances() {
  const [toggleId, setToggleId] = useState(null);

  const { openModal } = useModal();

  const { data: balances, isLoading } = useBalances();

  const { mutate: deleteId } = useDeleteBalance();

  function handleDeleteBalance(id, accountNumber) {
    openModal({
      type: "confirm",
      title: `Are you sure you want to remove ${accountNumber}`,
      onConfirm: () => deleteId(id),
    });
  }

  function handleToggle(id) {
    setToggleId((prev) => (prev === id ? null : id));
  }

  function handleAddBalance() {
    openModal({ content: <BalanceForm /> });
  }

  if (isLoading) return <Loader />;

  return (
    <Section title="Balances">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
        {balances.map((balance) => {
          const isCard = !!balance.type.includes("Card");

          const serviceType = isCard ? "Card" : "Account";

          const isToggle = toggleId === balance.id;

          const PasswordToggle = !isToggle ? IoEyeOutline : IoEyeOffOutline;

          const accountNumber = formatAccountNumber(balance.account_number, {
            type: balance.type,
            masked: !isToggle,
          });

          return (
            <Card key={balance.id} className="!gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-previous/25">
                <p className="font-bold text-card tracking-wide">
                  {balance.type}
                </p>

                <div className="flex items-center gap-3">
                  <p className="font-medium text-xs text-notification">
                    {balance.service}
                  </p>
                  {isCard && (
                    <img src={balance.icon} className="w-7 h-7" alt="icon" />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg md:text-xl text-black">
                        {accountNumber}
                      </p>

                      <p className="text-sm text-date">{serviceType} Number</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(balance.id)}
                      className="cursor-pointer"
                    >
                      <PasswordToggle className="w-5 h-5 text-date" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-lg md:text-xl text-black">
                      ${balance.total}
                    </p>

                    <p className="text-sm text-date">Total Amount</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className="text-primary cursor-pointer"
                    onClick={() => {
                      handleDeleteBalance(balance.id, accountNumber);
                    }}
                  >
                    Remove
                  </p>

                  <Button
                    variant="secondary"
                    route={`account/details/${balance.id}`}
                    className="flex items-center gap-2 !py-[10px] px-5 !font-medium text-sm"
                  >
                    Details
                    <MdKeyboardArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        <Card>
          <EmptyState description="Add new balance" action={handleAddBalance} />
        </Card>
      </div>
    </Section>
  );
}

export default Balances;
