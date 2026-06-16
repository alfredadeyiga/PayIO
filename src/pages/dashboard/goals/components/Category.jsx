import { FiEdit3 } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import InputField from "../../../../components/ui/InputField";
import Section from "../../../../components/layout/Section";
import Card from "../../../../components/ui/Card";
import { categoryIcons } from "../../../../constants/categoryOptions";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useModal } from "../../../../context/ModalContext";
import { useGoals } from "../../../../hooks/features/goals/useGoals";
import { formatCapitalize } from "../../../../utils/formatCapitalize";
import { getCurrentPeriod } from "../../../../utils/formatDate";
import Form from "../../../../components/ui/Form";
import { useSaveGoals } from "../../../../hooks/features/goals/useSaveGoals";
import UpdateForm from "../../../../components/ui/UpdateForm";

function Category() {
  const { openModal } = useModal();

  const { data } = useGoals();

  const { mutate } = useSaveGoals();

  const currentPeriod = data?.find(
    (goal) => goal.period === getCurrentPeriod(),
  );

  const expensesGoals = currentPeriod?.expense_goals || [];

  const categoryLookup = Object.fromEntries(
    expensesGoals?.map((item) => [item.category, item]),
  );

  const categories = Object.keys(categoryIcons);

  const goals = categories.map((category) => ({
    category,
    target: categoryLookup[category]?.target || 0,
  }));

  function handleUpdateGoal(e, category) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const target = Number(formData.get(category));

    const updatedGoals = expensesGoals.some(
      (item) => item.category === category,
    )
      ? expensesGoals.map((item) =>
          item.category === category ? { ...item, target } : item,
        )
      : [...expensesGoals, { category, target }];

    const currentTarget = goals.find(
      (goal) => goal.category === category,
    ).target;

    if (target !== currentTarget) {
      mutate({
        period: getCurrentPeriod(),
        expense_goals: updatedGoals,
      });
    }
  }

  function handleAdjustModal(category, target) {
    openModal({
      content: (
        <UpdateForm
          id={category}
          label={formatCapitalize(category)}
          placeholder={`$${target}`}
          onSubmit={(e) => handleUpdateGoal(e, category)}
        ></UpdateForm>
      ),
    });
  }

  return (
    <Section title="Expenses Goals by Category">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4">
        {goals.map((goal, index) => {
          const Icon = categoryIcons[goal.category];

          return (
            <Card key={index} variant="category">
              <div className="flex gap-4 items-center">
                <span className="bg-previous/25 py-3 px-2 rounded-lg text-search">
                  <Icon className="w-6 h-6" />
                </span>

                <div className="flex flex-col">
                  <p className="font-medium text-date text-sm md:text-base">
                    {formatCapitalize(goal.category)}
                  </p>

                  <p className="font-bold md:text-lg text-black">
                    ${formatCurrency(goal.target)}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleAdjustModal(goal.category, goal.target);
                }}
              >
                <span className="font-medium text-sm">Adjust</span>
                <FiEdit3 className="w-4 h-4" />
              </Button>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

export default Category;
