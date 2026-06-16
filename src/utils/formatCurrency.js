import { formatCompact } from "./formatCompact";

export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "0.00";

  if (value >= 1_000_000) return formatCompact(value);

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatCurrencyRounded = (value) => {
  if (value == null || isNaN(value)) return "0.00";

  if (value >= 10_000_000) return formatCompact(value);

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
};
