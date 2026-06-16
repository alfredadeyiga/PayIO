import Breakdown from "./components/Breakdown";
import Comparison from "./components/Comparison";

function Expenses() {
  return (
    <div className="flex flex-col gap-8">
      <Comparison />
      <Breakdown />
    </div>
  );
}

export default Expenses;
