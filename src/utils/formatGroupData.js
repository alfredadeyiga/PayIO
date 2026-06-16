import { isSameMonth, subMonths } from "date-fns";
import { formatShortMonth } from "./formatDate";

export function groupByMonth({ transactions, limit }) {
  const result = {};

  if (!transactions?.length) return [];

  const latestTransaction = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )[0];

  const latestDate = new Date(latestTransaction.date);

  for (let i = limit; i >= 0; i--) {
    const date = new Date(latestDate);

    date.setMonth(latestDate.getMonth() - i);

    const month = date.toLocaleString("default", {
      month: "short",
    });

    result[month] = {
      label: month,
      revenue: 0,
      expenses: 0,
    };
  }

  transactions.forEach((tx) => {
    const date = new Date(tx.date);

    const month = date.toLocaleString("default", {
      month: "short",
    });

    if (!result[month]) return;

    if (tx.transaction_type === "revenue") {
      result[month].revenue += tx.amount;
    } else {
      result[month].expenses += tx.amount;
    }
  });

  return Object.values(result);
}

export function groupByWeek({ transactions, limit }) {
  const result = {};

  if (!transactions?.length) return [];

  const latestTransaction = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )[0];

  const latestDate = new Date(latestTransaction.date);

  for (let i = limit; i >= 0; i--) {
    const date = new Date(latestDate);
    date.setDate(latestDate.getDate() - i * 7);

    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const label = startOfWeek.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    result[label] = { label, revenue: 0, expenses: 0 };
  }

  transactions?.forEach((tx) => {
    const date = new Date(tx.date);

    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const label = startOfWeek.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    if (!result[label]) return;

    if (tx.transaction_type === "revenue") {
      result[label].revenue += tx.amount;
    } else {
      result[label].expenses += tx.amount;
    }
  });

  return Object.values(result);
}

export function groupByCategory(transactions) {
  const result = {};
  const previousTotals = {};

  const currentDate = new Date();
  const previousMonth = subMonths(currentDate, 1);

  transactions?.forEach((tx) => {
    if (tx.transaction_type !== "expenses") return;

    const date = new Date(tx.date);
    const category = tx.category;

    if (isSameMonth(date, currentDate)) {
      if (!result[category]) {
        result[category] = {
          category,
          details: [],
          total: 0,
          percentChange: 0,
          change: "",
        };
      }

      result[category].details.push({
        title: tx.item_name,
        amount: tx.amount,
        date: formatShortMonth(tx.date),
      });

      result[category].total += tx.amount;
    }

    if (isSameMonth(date, previousMonth)) {
      previousTotals[category] = (previousTotals[category] || 0) + tx.amount;
    }
  });

  Object.values(result).forEach((categoryData) => {
    const previousTotal = previousTotals[categoryData.category] || 0;

    if (previousTotal === 0) {
      categoryData.percentChange = categoryData.total > 0 ? 100 : 0;
    } else {
      categoryData.percentChange = (
        ((categoryData.total - previousTotal) / previousTotal) *
        100
      ).toFixed();
    }

    if (categoryData.percentChange !== 0) {
      categoryData.change =
        categoryData.percentChange > 0 ? "Increase" : "Decrease";
    }
  });

  return Object.values(result);
}

export function formatSavingsChartData(transactions, period) {
  const [monthName, yearString] = period.split(" ");

  const year = Number(yearString);

  const month = new Date(`${monthName} 1, ${year}`).getMonth() + 1;

  const today = new Date();

  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  const lastDay = isCurrentMonth
    ? today.getDate()
    : new Date(year, month, 0).getDate();

  const dailyTotals = {};

  transactions?.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);

    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1;

    if (transactionYear !== year || transactionMonth !== month) {
      return;
    }

    const day = transactionDate.getDate();

    if (!dailyTotals[day]) {
      dailyTotals[day] = 0;
    }

    const amount =
      transaction.transaction_type === "revenue"
        ? transaction.amount
        : -transaction.amount;

    dailyTotals[day] += amount;
  });

  return Array.from({ length: lastDay }, (_, index) => {
    const day = index + 1;

    const total = dailyTotals[day] || 0;

    return {
      date: new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }),

      amount: Math.max(total, 0),
    };
  });
}
