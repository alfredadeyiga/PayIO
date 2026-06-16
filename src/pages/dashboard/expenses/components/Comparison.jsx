import { useState } from "react";
import Section from "../../../../components/layout/Section";
import StatisticsCard from "../../../../components/ui/StatisticsCard";

function Comparison() {
  const [selectedOption, setSelectedOption] = useState("monthly");

  return (
    <Section title="Expenses Comparison">
      <StatisticsCard
        variant="dashboard"
        selectedOption={selectedOption}
        setSelectedOption={(option) => setSelectedOption(option)}
      />
    </Section>
  );
}

export default Comparison;
