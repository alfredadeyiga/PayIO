export const formatMonth = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
  });
};

export const formatShortMonth = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDay = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
  });
};

export const formatPeriod = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
};

export const getCurrentPeriod = () => {
  return new Date().toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

export const formatMonthRange = (period) => {
  const [monthName, year] = period.split(" ");

  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const shortMonth = firstDay.toLocaleString("en-US", {
    month: "short",
  });

  return `${String(firstDay.getDate()).padStart(2, "0")} ${shortMonth} - ${String(lastDay.getDate()).padStart(2, "0")} ${shortMonth}`;
};
