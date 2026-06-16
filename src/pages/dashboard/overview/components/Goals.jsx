import { FiEdit3 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Section from "../../../../components/layout/Section";
import Card from "../../../../components/ui/Card";
import GoalsMetrics from "../../../../components/ui/GoalsMetrics";
import { formatCurrencyRounded } from "../../../../utils/formatCurrency";
import EmptyState from "../../../../components/ui/EmptyState";
import { useModal } from "../../../../context/ModalContext";
import GoalsForm from "../../../../components/ui/GoalsForm";
import { useGoals } from "../../../../hooks/features/goals/useGoals";
import Loader from "../../../../components/ui/Loader";
import { getCurrentPeriod } from "../../../../utils/formatDate";

function Goals() {
  const { openModal } = useModal();

  const { data, isLoading } = useGoals();

  const hasData = data?.length > 0;

  const currentGoal = data?.find((goal) => goal.period === getCurrentPeriod());

  function formattedPeriod() {
    const month = new Date().toLocaleDateString("en-GB", {
      month: "long",
    });
    const year = new Date().toLocaleDateString("en-GB", {
      year: "numeric",
    });

    return `${month}, ${year}`;
  }

  function handleAddGoal() {
    openModal({
      content: <GoalsForm />,
    });
  }

  if (isLoading) return <Loader />;

  return (
    <Section variant="overview" title="Goals">
      <Card id="goals">
        {hasData ? (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between w-full gap-4 items-center pb-3 border-b border-divider">
              <div className="flex items-center gap-2">
                <p className="font-bold text-2xl text-black">
                  ${formatCurrencyRounded(currentGoal?.target) || 0}
                </p>

                <Link
                  to="/dashboard/goals"
                  className="bg-previous/25 text-search w-8 h-8 p-2 rounded"
                >
                  <FiEdit3 />
                </Link>
              </div>

              <p className="font-medium text-sm text-right text-search">
                {formattedPeriod()}
              </p>
            </div>

            <GoalsMetrics goal={currentGoal} />
          </div>
        ) : (
          <EmptyState
            description="Add your monthly goal"
            action={handleAddGoal}
          />
        )}
      </Card>
    </Section>
  );
}

export default Goals;
