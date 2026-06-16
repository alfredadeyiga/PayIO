import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCompact } from "../../utils/formatCompact";
import { formatCurrencyRounded } from "../../utils/formatCurrency";

function SavingsChart({ data }) {
  const indexLength = data.length - 1;

  let gap = 4;

  if (data.length <= 8) {
    gap = 1;
  } else if (indexLength % 2 === 0 && indexLength / 2 <= 7) {
    gap = 2;
  } else if (indexLength % 3 === 0 && indexLength / 3 <= 7) {
    gap = 3;
  } else if ([14, 27].includes(data.length) || indexLength % 5 === 0) {
    gap = 5;
  } else if ([23, 24].includes(data.length)) {
    gap = 6;
  } else if (data.length === 28) {
    gap = 7;
  }

  const visibleTicks = data
    .filter((_, i) => i % gap === 0 || i === indexLength)
    .map((d) => d.date);

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg rounded-md px-3 py-2 text-sm">
          <p className="font-semibold text-notification">
            {label || data[0].date}
          </p>
          <p className="text-primary mt-1">
            ${formatCurrencyRounded(payload[0].value)}
          </p>
        </div>
      );
    }

    return null;
  }

  const chartData =
    data.length === 1 ? [data[0], { ...data[0], date: "" }] : data;

  return (
    <div className="h-[200px] overflow-hidden">
      <ResponsiveContainer width="100%" height="105%">
        <AreaChart data={chartData} margin={{ right: 2, top: 5, bottom: 16 }}>
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#299D91" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#D9D9D9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E8E8E8" horizontal={false} />
          <Tooltip content={<CustomTooltip />} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9F9F9F", fontSize: 12, fontWeight: 500 }}
            ticks={visibleTicks}
            dy={16}
          />
          <YAxis
            width="auto"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9F9F9F", fontSize: 14 }}
            tickFormatter={(value) => `$${formatCompact(value).toLowerCase()}`}
            tickCount={4}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#299D91"
            fillOpacity={1}
            fill="url(#colorSavings)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SavingsChart;
