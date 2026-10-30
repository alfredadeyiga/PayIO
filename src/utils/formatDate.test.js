import {
  formatMonth,
  formatShortMonth,
  formatDay,
  formatPeriod,
  getCurrentPeriod,
  currentDate,
  getToday,
  formatMonthRange,
} from "./formatDate";

describe("formatMonth", () => {
  it("returns the abbreviated month name", () => {
    expect(formatMonth("2026-05-15")).toBe("May");
  });
});

describe("formatShortMonth", () => {
  it("formats the date with abbreviated month and pads single-digit days with a zero", () => {
    expect(formatShortMonth("2026-05-05")).toBe("05 May 2026");
  });
});

describe("formatDay", () => {
  it("returns the numeric day of the month", () => {
    expect(formatDay("2026-05-15")).toBe("15");
  });
});

describe("formatPeriod", () => {
  it("returns the abbreviated month and year", () => {
    expect(formatPeriod("2026-05-15")).toBe("May 2026");
  });
});

describe("getCurrentPeriod", () => {
  it("returns the current month and year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4));

    expect(getCurrentPeriod()).toBe("May 2026");
  });
});

describe("currentDate", () => {
  it("returns the current date", () => {
    expect(currentDate).toMatch(/^[A-Za-z]+ \d{1,2}, \d{4}$/);
  });
});

describe("getToday", () => {
  it("returns today's date in YYYY-MM-DD format", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 5));

    expect(getToday()).toBe("2026-05-05");
  });
});

describe("formatMonthRange", () => {
  it("returns the first and last day of the specified month", () => {
    expect(formatMonthRange("May 2026")).toBe("01 May - 31 May");
  });
});
