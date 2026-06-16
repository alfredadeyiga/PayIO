import { toast } from "react-toastify";
import { useGoals } from "../../hooks/features/goals/useGoals";
import { useSaveGoals } from "../../hooks/features/goals/useSaveGoals";
import Form from "./Form";
import InputField from "./InputField";
import { getCurrentPeriod } from "../../utils/formatDate";

function GoalsForm() {
  const { data } = useGoals();

  const { mutate } = useSaveGoals();

  const thisMonth = data?.find((goal) => goal.period === getCurrentPeriod());

  function handleUpsertGoal(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const achieved = Number(formData.get("achieved"));

    const target = Number(formData.get("target"));

    const newTarget = target && target !== thisMonth.target;

    const newAchieved = achieved && achieved !== thisMonth.achieved;

    if (!newTarget && !newAchieved) {
      toast.info("No changes were made");
      return;
    }

    mutate({
      achieved: achieved || thisMonth.achieved,
      target: target || thisMonth.target,
      period: getCurrentPeriod(),
    });
  }

  return (
    <Form variant="dashboard" onSubmit={handleUpsertGoal}>
      <InputField
        id="achieved"
        variant="dashboard"
        label="Target Achieved"
        type="number"
        min={0}
        placeholder={`$${thisMonth?.achieved || "0"}`}
        required={!thisMonth?.achieved}
      />
      <InputField
        id="target"
        variant="dashboard"
        label="Month Target"
        type="number"
        placeholder={`$${thisMonth?.target || "0"}`}
        required={!thisMonth?.target}
      />
    </Form>
  );
}

export default GoalsForm;
