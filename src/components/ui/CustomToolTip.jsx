import { formatCurrencyRounded } from "../../utils/formatCurrency";

function CustomToolTip({ active, payload, label, data }) {
  if (active && payload && payload.length) {
    return (
      <div
        data-testid="tooltip"
        className="bg-white shadow-lg rounded-md px-3 py-2 text-sm"
      >
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

export default CustomToolTip;
