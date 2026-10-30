import { formatPeriodOptions } from "./formatPeriodOptions";

describe("formatPeriodOptions", () => {
  it("removes duplicate dates and sorts them in descending order", () => {
    const data = [
      { label: "May 2026", value: "2026-05-01" },
      { label: "May 2026", value: "2026-05-01" },
      { label: "October 2026", value: "2026-10-01" },
      { label: "January 2026", value: "2026-01-01" },
    ];

    const formattedData = [
      { label: "October 2026", value: "2026-10-01" },
      { label: "May 2026", value: "2026-05-01" },
      { label: "January 2026", value: "2026-01-01" },
    ];

    expect(formatPeriodOptions(data)).toEqual(formattedData);
  });
});
