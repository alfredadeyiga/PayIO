import { useRef, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import Button from "../../../../components/ui/Button";
import Card from "../../../../components/ui/Card";
import GoalsMetrics from "../../../../components/ui/GoalsMetrics";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import EmptyState from "../../../../components/ui/EmptyState";
import { useModal } from "../../../../context/ModalContext";
import GoalsForm from "../../../../components/ui/GoalsForm";
import { useGoals } from "../../../../hooks/features/goals/useGoals";
import {
  formatMonthRange,
  getCurrentPeriod,
} from "../../../../utils/formatDate";
import { formatPeriodOptions } from "../../../../utils/formatPeriodOptions";

function Goal() {
  const [showOptions, setShowOptions] = useState(false);

  const currentPeriod = getCurrentPeriod();

  const defaultOption = {
    value: currentPeriod,
    label: formatMonthRange(currentPeriod),
  };

  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const { openModal } = useModal();

  const { data } = useGoals();

  const hasData = data?.length > 0;

  const showButton = selectedOption.value === currentPeriod;

  const rangeRef = useRef();

  useOutsideClick(rangeRef, () => setShowOptions(false));

  const dropdownOptions = [
    defaultOption,
    ...(data?.map((goal) => ({
      value: goal.period,
      label: formatMonthRange(goal.period),
    })) || []),
  ];

  const options = formatPeriodOptions(dropdownOptions);

  const currentGoal = data?.find(
    (goal) => goal.period === selectedOption.value,
  );

  function handleUpdateGoal() {
    openModal({
      content: <GoalsForm />,
    });
  }

  return (
    <Card variant="breakdown" className={`p-6 ${hasData && "pt-5"}`}>
      {hasData ? (
        <div className="flex flex-col items-center gap-5">
          <div className="flex w-full justify-between items-center pb-3 border-b border-divider">
            <p className="font-bold text-search">Savings Goal</p>

            <div
              ref={rangeRef}
              className="relative inline-block"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              <button
                type="button"
                className="bg-previous/25 flex items-center gap-2 py-2 px-4 border border-header rounded font-medium text-xs text-notification cursor-pointer"
              >
                {selectedOption.label}
                <MdKeyboardArrowDown className="w-4 h-4 text-search" />
              </button>

              {showOptions && (
                <CustomDropdown
                  options={options}
                  setSelected={(option) => setSelectedOption(option)}
                  onClick={() => setShowOptions(false)}
                  className="font-medium text-xs text-notification pl-4"
                />
              )}
            </div>
          </div>

          <GoalsMetrics goal={currentGoal} />

          {showButton && (
            <Button type="button" variant="outline" onClick={handleUpdateGoal}>
              <p className="font-medium text-sm">Adjust Goal</p>
              <FiEdit3 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <EmptyState
          description="Add your monthly goal"
          action={handleUpdateGoal}
        />
      )}
    </Card>
  );
}

export default Goal;
