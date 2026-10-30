import {
  groupByMonth,
  groupByWeek,
  groupByCategory,
  formatSavingsChartData,
} from "./formatGroupData";

describe("groupByMonth", () => {
  it("returns an empty array when transactions are empty", () => {
    expect(groupByMonth({ transactions: [], limit: 3 })).toEqual([]);
  });

  it("groups revenue and expenses by month", () => {
    const transactions = [
      { date: "2026-04-05", transaction_type: "revenue", amount: 500 },
      { date: "2026-04-10", transaction_type: "expense", amount: 100 },
      { date: "2026-05-15", transaction_type: "revenue", amount: 300 },
      { date: "2026-05-20", transaction_type: "expense", amount: 50 },
    ];

    const result = groupByMonth({ transactions, limit: 1 });

    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      label: "Apr",
      revenue: 500,
      expenses: 100,
    });

    expect(result[1]).toMatchObject({
      label: "May",
      revenue: 300,
      expenses: 50,
    });
  });

  it("includes months without transactions", () => {
    const transactions = [
      { date: "2026-01-15", transaction_type: "revenue", amount: 100 },
      { date: "2026-03-15", transaction_type: "revenue", amount: 200 },
    ];

    const result = groupByMonth({ transactions, limit: 2 });

    expect(result[1]).toMatchObject({ label: "Feb", revenue: 0, expenses: 0 });
  });
});

describe("groupByWeek", () => {
  it("returns an empty array when transactions are empty", () => {
    expect(groupByWeek({ transactions: [], limit: 2 })).toEqual([]);
  });

  it("groups revenue and expenses by week", () => {
    const transactions = [
      { date: "2026-05-04", transaction_type: "revenue", amount: 500 },
      { date: "2026-05-06", transaction_type: "expense", amount: 100 },
      { date: "2026-05-11", transaction_type: "revenue", amount: 300 },
    ];

    const result = groupByWeek({ transactions, limit: 1 });

    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      label: "03 May",
      revenue: 500,
      expenses: 100,
    });

    expect(result[1]).toMatchObject({
      label: "10 May",
      revenue: 300,
      expenses: 0,
    });
  });

  it("includes weeks without transactions", () => {
    const transactions = [
      { date: "2026-05-04", transaction_type: "revenue", amount: 100 },
      { date: "2026-05-18", transaction_type: "revenue", amount: 200 },
    ];

    const result = groupByWeek({ transactions, limit: 2 });

    expect(result[1]).toMatchObject({
      label: "10 May",
      revenue: 0,
      expenses: 0,
    });
  });
});

describe("groupByCategory", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns an empty array when transactions are empty", () => {
    expect(groupByCategory([])).toEqual([]);
  });

  it("groups current month expenses by category", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15, 12));

    const transactions = [
      {
        date: "2026-05-02",
        transaction_type: "expenses",
        category: "Food",
        item_name: "Groceries",
        amount: 100,
      },
      {
        date: "2026-05-10",
        transaction_type: "expenses",
        category: "Food",
        item_name: "Lunch",
        amount: 50,
      },
      {
        date: "2026-05-12",
        transaction_type: "revenue",
        category: "Food",
        item_name: "Refund",
        amount: 25,
      },
    ];

    const result = groupByCategory(transactions);

    expect(result).toHaveLength(1);

    expect(result[0].category).toBe("Food");

    expect(result[0].total).toBe(150);

    expect(result[0].details).toHaveLength(2);
  });

  it("calculates percentage change against the previous month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15, 12));

    const transactions = [
      {
        date: "2026-04-05",
        transaction_type: "expenses",
        category: "Food",
        item_name: "Previous groceries",
        amount: 100,
      },
      {
        date: "2026-05-05",
        transaction_type: "expenses",
        category: "Food",
        item_name: "Current groceries",
        amount: 150,
      },
    ];

    const result = groupByCategory(transactions);

    expect(result[0].percentChange).toBe("50");

    expect(result[0].change).toBe("Increase");
  });

  it("returns a 100 percent increase when the previous total is zero", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15, 12));

    const transactions = [
      {
        date: "2026-05-05",
        transaction_type: "expenses",
        category: "Travel",
        item_name: "Bus fare",
        amount: 50,
      },
    ];

    const result = groupByCategory(transactions);

    expect(result[0].percentChange).toBe(100);
    expect(result[0].change).toBe("Increase");
  });

  it("ignores transactions from older months", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15, 12));

    const transactions = [
      {
        date: "2026-03-05",
        transaction_type: "expenses",
        category: "Food",
        item_name: "Old groceries",
        amount: 100,
      },
    ];

    expect(groupByCategory(transactions)).toEqual([]);
  });
});

describe("formatSavingsChartData", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns zero-valued entries for a past month with no transactions", () => {
    const result = formatSavingsChartData([], "May 2025");

    expect(result).toHaveLength(31);

    expect(result.every((day) => day.amount === 0)).toBe(true);
  });

  it("calculates daily net savings", () => {
    const transactions = [
      {
        date: "2026-05-05",
        transaction_type: "revenue",
        amount: 500,
      },
      {
        date: "2026-05-05",
        transaction_type: "expense",
        amount: 200,
      },
      {
        date: "2026-05-06",
        transaction_type: "expense",
        amount: 100,
      },
    ];

    const result = formatSavingsChartData(transactions, "May 2026");

    expect(result[4]).toMatchObject({
      date: "May 05",
      amount: 300,
    });

    expect(result[5]).toMatchObject({
      date: "May 06",
      amount: 0,
    });
  });

  it("does not return negative daily savings", () => {
    const transactions = [
      { date: "2026-05-10", transaction_type: "revenue", amount: 100 },
      { date: "2026-05-10", transaction_type: "expense", amount: 250 },
    ];

    const result = formatSavingsChartData(transactions, "May 2026");

    expect(result[9].amount).toBe(0);
  });

  it("excludes transactions outside the selected month", () => {
    const transactions = [
      { date: "2026-04-30", transaction_type: "revenue", amount: 500 },
      { date: "2026-05-05", transaction_type: "revenue", amount: 100 },
      { date: "2026-06-01", transaction_type: "revenue", amount: 300 },
    ];

    const result = formatSavingsChartData(transactions, "May 2026");

    expect(result[4].amount).toBe(100);

    expect(result.reduce((sum, day) => sum + day.amount, 0)).toBe(100);
  });

  it("returns only days up to today for the current month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15, 12));

    const result = formatSavingsChartData([], "May 2026");

    expect(result).toHaveLength(15);

    expect(result[0].date).toBe("May 01");

    expect(result[14].date).toBe("May 15");
  });
});
