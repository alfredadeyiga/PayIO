import Section from "../../../components/layout/Section";
import Category from "./components/Category";
import Goal from "./components/Goal";
import Summary from "./components/Summary";

function Goals() {
  return (
    <div className="flex flex-col gap-8">
      <Section title="Goals">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          <Goal />

          <div className="xl:col-span-2">
            <Summary />
          </div>
        </div>
      </Section>

      <Category />
    </div>
  );
}

export default Goals;
