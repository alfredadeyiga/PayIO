import { useState } from "react";
import Section from "../../../../components/layout/Section";
import StatisticsCard from "../../../../components/ui/StatisticsCard";

function Statistics() {
  const [selectedOption, setSelectedOption] = useState("weekly");

  return (
    <Section variant="overview" title="Statistics">
      <StatisticsCard
        selectedOption={selectedOption}
        setSelectedOption={(option) => setSelectedOption(option)}
      />
    </Section>
  );
}

export default Statistics;
