import { formatCurrencyRounded } from "../../utils/formatCurrency";

function SavingsCard({ data }) {
  function groupedData() {
    const grouped = [];
    const chunkSize = 5;

    for (let i = 0; i < data.length; i += chunkSize) {
      let chunk = data.slice(i, i + chunkSize);

      if (chunk.length === 1 && grouped.length > 0) {
        const lastGroup = grouped.pop();
        chunk = [...lastGroup.items, ...chunk];
      }

      const totalAmount = chunk.reduce((sum, item) => sum + item.amount, 0);

      const startDate = chunk[0].date;
      const endDate = chunk[chunk.length - 1].date;

      const label =
        startDate === endDate ? startDate : `${startDate} - ${endDate}`;

      grouped.push({
        label,
        amount: totalAmount,
        items: chunk,
      });
    }

    return grouped.map(({ items, ...rest }) => rest);
  }

  return (
    <div className="flex flex-col gap-2 border-t border-previous/25 pt-5 md:pb-1">
      {groupedData().map((item) => (
        <div
          key={item.label}
          className="flex justify-between items-center gap-4"
        >
          <span className="font-semibold text-notification">{item.label}</span>

          <span className="font-medium text-primary">
            ${formatCurrencyRounded(item.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SavingsCard;
